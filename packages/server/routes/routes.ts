import express, { Router } from 'express';
import Stripe from 'stripe';
import mongoose from 'mongoose';

type Deps = {
    stripe: Stripe;
    Booking: mongoose.Model<any>;
    Classes: mongoose.Model<any>;
    PRICE_MAP: Record<string, string>;
    ALLOWED_CLASS_NAMES: string[];
    ALLOWED_TIME_SLOTS: number[];
    YOUR_DOMAIN: string;
    webhookSecret?: string;
};

// webhook router to handle Stripe events
export function createWebhookRouter({
    stripe,
    Booking,
    webhookSecret,
}: Deps): Router {
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

                const bookingData = {
                    email: session.customer_details?.email,
                    date: bookingDate,
                    time: session.metadata?.time ? Number(session.metadata.time) : undefined,
                    className: session.metadata?.className,
                    paymentType: session.metadata?.paymentType,
                    numAttendees: session.metadata?.numAttendees
                        ? Number(session.metadata.numAttendees)
                        : undefined,
                };

                try {
                    await Booking.create(bookingData);
                } catch (e: any) {
                    if (e?.code === 11000) {
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
    PRICE_MAP,
    ALLOWED_CLASS_NAMES,
    ALLOWED_TIME_SLOTS,
    YOUR_DOMAIN,
}: Deps): Router {
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
        const times = bookings.map((b: any) => b.time);
        res.json(times);
    });

    // POST /api/create-checkout-session
    router.post('/create-checkout-session', async (req, res) => {
        const { paymentType, numAttendees, date, time, className } = req.body as {
            paymentType: keyof typeof PRICE_MAP;
            numAttendees: number;
            date: string;
            time: number;
            className: string;
        };

        // validate all client inputs
        // todo: fix these errors as they don't show up on the server or client
        if (!PRICE_MAP[className]) {
            return res.status(400).json({ error: 'Invalid plan selected' });
        }
        if (!ALLOWED_CLASS_NAMES.includes(className)) {
            return res.status(400).json({ error: 'Invalid class selected' });
        }
        const parsedTime = Number(time);
        if (!ALLOWED_TIME_SLOTS.includes(parsedTime as any)) {
            return res.status(400).json({ error: 'Invalid time selected' });
        }
        const attendees = Number(numAttendees);
        if (!Number.isInteger(attendees) || attendees < 1 || attendees > 30) {
            return res.status(400).json({ error: 'Invalid attendee count' });
        }
        if (!date) {
            return res.status(400).json({ error: 'Date and time required' });
        }

        // normalize date (midnight) to match storage
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            return res.status(400).json({ error: 'Invalid date' });
        }
        d.setHours(0, 0, 0, 0);

        // Reject if already booked
        const existing = await Booking.findOne({ date: d, time: parsedTime });
        if (existing) {
            return res.status(409).json({ error: 'Time slot already booked' });
        }

        const priceId = PRICE_MAP[className];
        if (!priceId) {
            return res.status(400).json({ error: 'Unable to match class name to price id' });
        }

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            line_items: [
                {
                    // check if classname matches an item in PRICE_MAP
                    price: priceId,
                    // if paymentType is "full", numAttendees is used, otherwise it's 1
                    // conveniently a deposit is just 1 attendee
                    // todo: change deposit to be more adjustable? (percentage, fixed amount, etc.)
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
        //console.log("class objects from db: ", classObjs);
        res.send(classObjs);
    });

    return router;
}