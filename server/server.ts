import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config({ path: './server/.env' });

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());

const YOUR_DOMAIN = 'http://localhost:5173';

// Map of price IDs for different payment types (full payment or deposit)
const PRICE_MAP = {
    full: 'price_1RvD8b2cQ3M4p8Cs2oo900Rj',
    deposit: "price_1RuGZw2cQ3M4p8CsV9wwyZQl"
}

// Connect to MongoDB
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("Error connecting to MongoDB: ", err));

// schema for booking data
const bookingSchema = new mongoose.Schema({
    email: String,
    date: Date,
    time: Number,
    className: String,
    paymentType: String,
    numAttendees: Number
});
// ensure one booking per date+time
bookingSchema.index({ date: 1, time: 1 }, { unique: true }); 

// booking model
const Booking = mongoose.model('Booking', bookingSchema);

/* Below are the routes, may need to move a separate file if more are added */

// webhook to handle Stripe events, puts customer data into MongoDB
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    // Check if the signature header is present
    if (!sig) {
        console.log("Missing Stripe signature header.");
        return res.sendStatus(400);
    }
    // Verify the webhook signature
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.log("STRIPE_WEBHOOK_SECRET is not defined in the environment variables.");
        return res.sendStatus(400);
    }
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Stripe webhook secret", process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Received event:", event.type);
    } catch (err) {
        console.log("Webhook signature verification failed. ", (err as Error).message);
        return res.sendStatus(400);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Metadata from session:", session.metadata);

        // customer data to be saved into db
        const bookingData = {
            email: session.customer_details?.email,
            date: session.metadata?.date ? new Date(session.metadata.date) : undefined,
            time: session.metadata?.time,
            className: session.metadata?.className,
            paymentType: session.metadata?.paymentType,
            numAttendees: session.metadata?.numAttendees ? Number(session.metadata.numAttendees) : undefined 
        };

        // Save to MongoDB
        try {
            await Booking.create(bookingData);
        } catch (e: any) {
            if (e.code === 11000) {
                console.warn("Duplicate booking ignored (already taken).");
            } else {
                console.error("DB save failed:", e);
            }
        }

    }

    res.json({ received: true });
});

// Middleware to parse JSON bodies, needs to be AFTER the webhook route
// to avoid parsing issues with raw body
app.use(express.json());


// Endpoint to create a checkout session
app.post('/api/create-checkout-session', async (req, res) => {
    // extract paymentType and numAttendees from request body
    const { paymentType, numAttendees, date, time }:
        { paymentType: keyof typeof PRICE_MAP; numAttendees: number; date: string; time: number } = req.body;
    if (!PRICE_MAP[paymentType]) {
        return res.status(400).json({ error: "Invalid plan selected" });
    }

    if (!date || time === undefined) {
        return res.status(400).json({ error: "Date and time required" });
    }

    // normalize date (midnight) to match storage
    const d = new Date(date);
    d.setHours(0,0,0,0);

    // reject if already booked
    const existing = await Booking.findOne({ date: d, time });
    if (existing) {
        return res.status(409).json({ error: "Time slot already booked" });
    }
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                // check if paymentType matches an item in PRICE_MAP
                price: PRICE_MAP[paymentType],
                // if paymentType is "full", numAttendees is used, otherwise it's 1
                quantity: paymentType === "full" ? numAttendees : 1,
            },
        ],
        mode: 'payment',
        return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        // adding metadata to the session for use in the webhook
        metadata: {
            date: d.toISOString(),
            time: String(time),
            className: req.body.className,
            paymentType: paymentType,
            numAttendees: String(numAttendees)
        }
    });
    res.json({ clientSecret: session.client_secret });
});

// Endpoint to retrieve session status
app.get('/api/session-status', async (req, res) => {
    const sessionId = req.query.session_id as string | undefined;

    // Check if sessionId is provided
    if (!sessionId) {
        return res.status(400).json({ error: "Session ID is required" });
    }
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // check if customer_details is present in the session
    if (!session.customer_details) {
        return res.status(404).json({ error: "Customer details not found" });
    }
    // sending back the session status and customer email for the return page
    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.get('/api/bookings', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: "Date is required" });
        }

        // Create date range for that day
        const start = new Date(date as string);
        start.setHours(0, 0, 0, 0);

        const end = new Date(date as string);
        end.setHours(23, 59, 59, 999);

        // Find only bookings for that date
        const bookings = await Booking.find({
            date: { $gte: start, $lte: end }
        }).select("time -_id");

        // Return an array of just the time numbers
        res.json(bookings.map(b => b.time));
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database query failed" });
    }
});


app.listen(4242, () => console.log('Running on port 4242'));