import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import mongoose from 'mongoose';
import { createWebhookRouter, createApiRouter } from './routes/routes.js';

dotenv.config({ path: './server/.env' });

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());

const YOUR_DOMAIN = 'http://localhost:5173';

// Allowed class names and time slots for booking
const ALLOWED_CLASS_NAMES = ["Kid's Birthday Party", "Sip & Paint", "Kid's Art Class", "Private Event"];
const ALLOWED_TIME_SLOTS = [1000, 1100, 1200, 1300, 1400, 1500, 1600];

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

// Connect to MongoDB
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected!"))
    .catch(err => console.error("Error connecting to MongoDB: ", err));


// Map of price IDs for different payment types (full payment or deposit)
const PRICE_MAP = {
    full: 'price_1RvD8b2cQ3M4p8Cs2oo900Rj',
    deposit: "price_1RuGZw2cQ3M4p8CsV9wwyZQl"
}

// validate the webhook secret
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not defined in the environment variables.");
}


// webhook router
app.use(
    createWebhookRouter({
        stripe,
        Booking,
        PRICE_MAP,
        ALLOWED_CLASS_NAMES,
        ALLOWED_TIME_SLOTS,
        YOUR_DOMAIN,
        webhookSecret: STRIPE_WEBHOOK_SECRET,
    })
);

// API router for other endpoints
app.use(
    '/api',
    createApiRouter({
        stripe,
        Booking,
        PRICE_MAP,
        ALLOWED_CLASS_NAMES,
        ALLOWED_TIME_SLOTS,
        YOUR_DOMAIN,
    })
);

app.listen(4242, () => console.log('Running on port 4242'));