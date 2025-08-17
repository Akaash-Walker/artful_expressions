import express, { Router } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';

// Domain types for models used by the routers
type BookingDoc = {
    email: string;
    date: Date;
    time: number;
    className: string;
    paymentType: 'full' | 'deposit';
    numAttendees: number;
};

type ClassDoc = {
    className: string;
    priceId: string;
    availableTimeSlots: number[];
    duration: number;
};

// Use a discrete slot step matching your time slots (e.g., 100 = 1 hour)
const SLOT_STEP = 100;

type WebhookDeps = {
    stripe: Stripe;
    Booking: mongoose.Model<BookingDoc>;
    Classes: mongoose.Model<ClassDoc>;
    webhookSecret?: string;
};

type ApiDeps = {
    stripe: Stripe;
    Booking: mongoose.Model<BookingDoc>;
    Classes: mongoose.Model<ClassDoc>;
    YOUR_DOMAIN: string;
};

// webhook router to handle Stripe events
export function createWebhookRouter({
    stripe,
    Booking,
    Classes,
    webhookSecret,
}: WebhookDeps): Router {
    const router = express.Router();

    // Important: raw body for Stripe webhook
    router.post('/webhook',
        express.raw({ type: 'application/json' }),
        async (req, res) => {
            const sig = req.headers['stripe-signature'];
            if (!sig || !webhookSecret) {
                console.error("Stripe webhook secret or signature not present");
                return res.sendStatus(400);
            }
            let event: Stripe.Event;
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
            } catch (err) {
                console.log('Webhook signature verification failed:', (err as Error).message);
                return res.sendStatus(400);
            }

            if (event.type === 'checkout.session.completed') {
                const session = event.data.object as Stripe.Checkout.Session;

                const rawDate = session.metadata?.date;
                const bookingDate = rawDate ? new Date(rawDate) : undefined;
                if (bookingDate) bookingDate.setHours(0, 0, 0, 0);

                const bookingData: Partial<BookingDoc> = {
                    email: session.customer_details?.email ?? undefined,
                    date: bookingDate,
                    time: session.metadata?.time ? Number(session.metadata.time) : undefined,
                    className: session.metadata?.className,
                    paymentType: session.metadata?.paymentType as BookingDoc['paymentType'] | undefined,
                    numAttendees: session.metadata?.numAttendees
                        ? Number(session.metadata.numAttendees)
                        : undefined,
                };

                try {
                    // Guard: prevent overlaps using durations
                    if (
                        bookingData.date && typeof bookingData.time === 'number' && bookingData.className
                    ) {
                        const klass = await Classes.findOne({ className: bookingData.className }, 'duration').lean();
                        const requestedDuration = (klass as { duration: number } | null)?.duration ?? SLOT_STEP;
                        const requestedSpan = Math.max(1, Math.ceil(requestedDuration / SLOT_STEP));
                        const requestedStartIdx = Math.floor(bookingData.time / SLOT_STEP);
                        const requestedEndIdx = requestedStartIdx + requestedSpan;

                        const sameDay = await Booking.find({ date: bookingData.date }, 'time className').lean();
                        if (sameDay.length) {
                            const names = Array.from(new Set((sameDay as Array<{ className: string }>).map(b => b.className)));
                            const other = await Classes.find({ className: { $in: names } }, 'className duration').lean();
                            const durationMap = new Map<string, number>();
                            (other as Array<{ className: string; duration: number }>).forEach(c => durationMap.set(c.className, c.duration));
                            for (const b of sameDay as Array<{ time: number; className: string }>) {
                                const dur = durationMap.get(b.className) ?? SLOT_STEP;
                                const span = Math.max(1, Math.ceil(dur / SLOT_STEP));
                                const startIdx = Math.floor(b.time / SLOT_STEP);
                                const endIdx = startIdx + span;
                                const overlaps = !(requestedEndIdx <= startIdx || endIdx <= requestedStartIdx);
                                if (overlaps) {
                                    console.warn('Webhook booking prevented due to overlap');
                                    return res.json({ received: true });
                                }
                            }
                        }
                    }

                    await Booking.create(bookingData);
                } catch (e: unknown) {
                    if (e && typeof e === 'object' && 'code' in e && (e as { code?: number }).code === 11000) {
                        console.warn('Duplicate booking ignored (already taken).');
                    } else {
                        console.error('DB save failed:', e);
                    }
                }
            }

            res.json({ received: true });
        }
    );

    return router;
}

// all other API routes
export function createApiRouter({
    stripe,
    Booking,
    Classes,
    YOUR_DOMAIN,
}: ApiDeps): Router {
    const router = express.Router();

    // JSON body for normal API
    router.use(express.json());

    // GET /api/bookings?date=...&className=...
    router.get('/bookings', async (req, res) => {
        const dateParam = String(req.query.date || '');
        const selectedClassName = req.query.className ? String(req.query.className) : undefined;
        if (!dateParam) return res.json([]);

        const d = new Date(dateParam);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
        d.setHours(0, 0, 0, 0);

        // Fetch all bookings for the date
        const bookings = await Booking.find({ date: d }, 'time className').lean();
        if (!bookings.length) return res.json([]);

        // Load durations for all classes referenced by bookings in one query
        const classNames = Array.from(new Set((bookings as Array<{ className: string }>).map(b => b.className)));
        const bookedClasses = await Classes.find({ className: { $in: classNames } }, 'className duration').lean();
        const durationByClass = new Map<string, number>();
        (bookedClasses as Array<{ className: string; duration: number }>).forEach(c => {
            durationByClass.set(c.className, c.duration);
        });

        // If a class is selected, proactively block any start time whose span would overlap existing bookings
        if (selectedClassName) {
            const sel = await Classes.findOne({ className: selectedClassName }, 'availableTimeSlots duration').lean();
            const selected = sel as ({ availableTimeSlots: number[]; duration: number } | null);
            if (!selected) return res.json([]);

            const requestedSpan = Math.max(1, Math.ceil(selected.duration / SLOT_STEP));

            // Build existing booking intervals in slot indices
            const intervals: Array<{ startIdx: number; endIdx: number }> = [];
            for (const b of bookings as Array<{ time: number; className: string }>) {
                const dur = durationByClass.get(b.className) ?? SLOT_STEP;
                const span = Math.max(1, Math.ceil(dur / SLOT_STEP));
                const startIdx = Math.floor(b.time / SLOT_STEP);
                intervals.push({ startIdx, endIdx: startIdx + span });
            }

            const blockedStarts = new Set<number>();
            for (const t of selected.availableTimeSlots) {
                const startIdx = Math.floor(t / SLOT_STEP);
                const endIdx = startIdx + requestedSpan;
                const overlaps = intervals.some(iv => !(endIdx <= iv.startIdx || iv.endIdx <= startIdx));
                if (overlaps) blockedStarts.add(t);
            }

            return res.json(Array.from(blockedStarts.values()).sort((a, b) => a - b));
        }

        // No selected class: return slots occupied by existing bookings (expanded by each booking's duration)
        const blocked = new Set<number>();
        for (const b of bookings as Array<{ time: number; className: string }>) {
            const duration = durationByClass.get(b.className) ?? SLOT_STEP; // default one slot if missing
            const spanSlots = Math.max(1, Math.ceil(duration / SLOT_STEP));
            const startIndex = Math.floor(b.time / SLOT_STEP);
            for (let i = 0; i < spanSlots; i++) {
                const t = (startIndex + i) * SLOT_STEP;
                blocked.add(t);
            }
        }

        res.json(Array.from(blocked.values()).sort((a, b) => a - b));
    });

    // POST /api/create-checkout-session
    router.post('/create-checkout-session', async (req, res) => {
        const { paymentType, numAttendees, date, time, className } = req.body as {
            paymentType: 'full' | 'deposit';
            numAttendees: unknown;
            date: string;
            time: unknown;
            className: string;
        };

        // basic presence/type checks
        if (!className) {
            return res.status(400).json({ error: 'Class name is required' });
        }
        if (paymentType !== 'full' && paymentType !== 'deposit') {
            return res.status(400).json({ error: 'Invalid payment type' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }

        const parsedTime = Number(time);
        if (!Number.isFinite(parsedTime)) {
            return res.status(400).json({ error: 'Invalid time selected' });
        }

        const attendees = Number(numAttendees);
        if (!Number.isInteger(attendees) || attendees < 1 || attendees > 30) {
            return res.status(400).json({ error: 'Invalid attendee count' });
        }

        // normalize date (midnight) to match storage
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return res.status(400).json({ error: 'Invalid date' });
        }
        d.setHours(0, 0, 0, 0);

        // validate class against DB and derive priceId + allowed time slots
        const klass = await Classes.findOne({ className }, 'priceId availableTimeSlots duration').lean();
        const klassLean = klass as ({ priceId: string; availableTimeSlots: number[]; duration: number } | null);
        if (!klassLean) {
            return res.status(400).json({ error: 'Invalid class selected' });
        }
        const allowedTimes = Array.isArray(klassLean.availableTimeSlots) ? klassLean.availableTimeSlots : [];
        if (!allowedTimes.includes(parsedTime)) {
            return res.status(400).json({ error: 'Invalid time selected for this class' });
        }

        // Overlap check using slot indices and durations for all bookings that day
        const requestedSpan = Math.max(1, Math.ceil(klassLean.duration / SLOT_STEP));
        const requestedStartIdx = Math.floor(parsedTime / SLOT_STEP);
        const requestedEndIdx = requestedStartIdx + requestedSpan; // exclusive

        const sameDayBookings = await Booking.find({ date: d }, 'time className').lean();
        if (sameDayBookings.length) {
            const otherClassNames = Array.from(new Set((sameDayBookings as Array<{ className: string }>).map(b => b.className)));
            const otherClasses = await Classes.find({ className: { $in: otherClassNames } }, 'className duration').lean();
            const durationMap = new Map<string, number>();
            (otherClasses as Array<{ className: string; duration: number }>).forEach(c => durationMap.set(c.className, c.duration));

            for (const b of sameDayBookings as Array<{ time: number; className: string }>) {
                const dur = durationMap.get(b.className) ?? SLOT_STEP;
                const span = Math.max(1, Math.ceil(dur / SLOT_STEP));
                const startIdx = Math.floor(b.time / SLOT_STEP);
                const endIdx = startIdx + span; // exclusive
                const overlaps = !(requestedEndIdx <= startIdx || endIdx <= requestedStartIdx);
                if (overlaps) {
                    return res.status(409).json({ error: 'Selected time overlaps an existing booking' });
                }
            }
        }

        const priceId = klassLean.priceId;
        if (!priceId) {
            return res.status(400).json({ error: 'Class is not configured with a price' });
        }

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    price: priceId,
                    quantity: paymentType === 'full' ? attendees : 1,
                },
            ],
            mode: 'payment',
            return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
            metadata: {
                date: d.toISOString(),
                time: String(parsedTime),
                className,
                paymentType,
                numAttendees: String(attendees),
            },
        });

        res.json({ clientSecret: session.client_secret });
    });

    router.get('/session-status', async (req, res) => {
        const sessionId = req.query.session_id as string | undefined;

        // Check if sessionId is provided
        if (!sessionId) {
            return res.status(400).json({ error: 'Session ID is required' });
        }
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }
        // check if customer_details is present in the session
        if (!session.customer_details) {
            return res.status(404).json({ error: 'Customer details not found' });
        }
        res.send({
            status: session.status,
            customer_email: session.customer_details.email,
        });
    });

    // GET /api/classes
    router.get('/classes', async (req, res) => {
        const classObjs = await Classes.find({}, 'className availableTimeSlots duration priceId').lean();
        res.send(classObjs);
    });

    return router;
}