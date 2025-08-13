import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config({ path: './server/.env' });

if (!process.env.VITE_STRIPE_SECRET_KEY) {
    throw new Error("VITE_STRIPE_SECRET_KEY is not defined in the environment variables.");
}
const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
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
        };

        // Save to MongoDB
        await Booking.create(bookingData);
    }

    res.json({ received: true });
});

// Middleware to parse JSON bodies, needs to be AFTER the webhook route
// to avoid parsing issues with raw body
app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    // extract paymentType and numAttendees from request body
    const { paymentType, numAttendees }: { paymentType: keyof typeof PRICE_MAP; numAttendees: number } = req.body;
    if (!PRICE_MAP[paymentType]) {
        return res.status(400).json({ error: "Invalid plan selected" });
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
            date: req.body.date,
            time: req.body.time,
            className: req.body.className,
            paymentType: req.body.paymentType,
            numAttendees: req.body.numAttendees
        }
    });
    res.json({ clientSecret: session.client_secret });
});

// Endpoint to retrieve session status
app.get('/session-status', async (req, res) => {
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

app.listen(4242, () => console.log('Running on port 4242'));