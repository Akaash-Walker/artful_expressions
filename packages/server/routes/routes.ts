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

type WebhookDeps = {
    stripe: Stripe;
    Booking: mongoose.Model<BookingDoc>;
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

    // GET /api/bookings?date=...
    router.get('/bookings', async (req, res) => {
        const dateParam = String(req.query.date || '');
        if (!dateParam) return res.json([]);

        const d = new Date(dateParam);
        if (isNaN(d.getTime())) return res.status(400).json({ error: 'Invalid date' });
        d.setHours(0, 0, 0, 0);

        const bookings = await Booking.find({ date: d }, 'time').lean();
        const times = (bookings as Array<{ time: number }>).map((b) => b.time);
        res.json(times);
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
        const klass = await Classes.findOne({ className }, 'priceId availableTimeSlots').lean();
        const klassLean = klass as ({ priceId: string; availableTimeSlots: number[] } | null);
        if (!klassLean) {
            return res.status(400).json({ error: 'Invalid class selected' });
        }
        const allowedTimes = Array.isArray(klassLean.availableTimeSlots) ? klassLean.availableTimeSlots : [];
        if (!allowedTimes.includes(parsedTime)) {
            return res.status(400).json({ error: 'Invalid time selected for this class' });
        }

        // Reject if already booked
        const existing = await Booking.findOne({ date: d, time: parsedTime });
        if (existing) {
            return res.status(409).json({ error: 'Time slot already booked' });
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