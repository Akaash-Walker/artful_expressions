import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config({path: './server/.env'});

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
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("Error connecting to MongoDB: ", err));

// schema for booking data
const bookingSchema = new mongoose.Schema({
    email: String,
    date: Date,
    time: String,
    className: String,
    paymentType: String
});

// booking model
const Booking = mongoose.model('Booking', bookingSchema);

/* Below are the routes, may need to move a separate file if more are added */

// webhook to handle Stripe events, puts customer data into MongoDB
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Stripe webhook secret", process.env.STRIPE_WEBHOOK_SECRET);
        console.log("Received event:", event.type);
    } catch (err) {
        console.log("Webhook signature verification failed. ", err.message);
        return res.sendStatus(400);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log("Metadata from session:", session.metadata);

        // Example: retrieve metadata or customer info
        const bookingData = {
            email: session.customer_details?.email,
            date: session.metadata?.date ? new Date(session.metadata.date) : undefined,
            time: session.metadata?.time,
            className: session.metadata?.className,
            paymentType: session.metadata?.paymentType
        };

        // Save to MongoDB
        await Booking.create(bookingData);
    }

    res.json({received: true});
});

// Middleware to parse JSON bodies, needs to be AFTER the webhook route
// to avoid parsing issues with raw body
app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const {paymentType} = req.body;
    if (!PRICE_MAP[paymentType]) {
        return res.status(400).json({error: "Invalid plan selected"});
    }
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                price: PRICE_MAP[paymentType],
                quantity: 1,
            },
        ],
        mode: 'payment',
        return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            email: req.body.email,
            date: req.body.date,
            time: req.body.time,
            className: req.body.className,
            paymentType: req.body.paymentType
        }
    });

    res.json({clientSecret: session.client_secret});
});

// Endpoint to retrieve session status
app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.listen(4242, () => console.log('Running on port 4242'));