import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import mongoose from 'mongoose';
import path from 'path';
import {fileURLToPath} from 'node:url';
// todo: fix .js extension to make it work for both dev and build, currently only works for build
import {createApiRouter, createWebhookRouter} from './routes/routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(projectRoot, ".env") });

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not defined in the environment variables.");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';

// schema for booking data
const bookingSchema = new mongoose.Schema({
    email: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    time: { type: Number, required: true, min: 0, max: 2359 },
    className: { type: String, required: true, trim: true },
    paymentType: { type: String, required: true, enum: ['full', 'deposit'] },
    numAttendees: { type: Number, required: true, min: 1, max: 30 }
});
// ensure one booking per date+time
bookingSchema.index({date: 1, time: 1}, {unique: true});

// booking model
const Booking = mongoose.model('Booking', bookingSchema);

// schema for classes
const classesSchema = new mongoose.Schema({
    className: { type: String, required: true, trim: true },
    priceId: { type: String, required: true, trim: true },
    availableTimeSlots: { type: [Number], required: true, default: [] },
    duration: { type: Number, required: true, min: 1 }
});

// ensure one class name per class
classesSchema.index({className: 1}, {unique: true});
// classes model
const Classes = mongoose.model('Classes', classesSchema);

// Create initial classes
Classes.create([
    {
        className: "Kid's Birthday Party",
        priceId: 'price_1Rw6i42cQ3M4p8CsMD6uK77z',
        availableTimeSlots: [900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500, 1530],
        duration: 60 // minutes
    },
    {
        className: "Sip & Paint",
        priceId: 'price_1Rw6iK2cQ3M4p8CshjVCIYUv',
        availableTimeSlots: [1700, 1730, 1800, 1830, 1900, 1930, 2000],
        duration: 120 // minutes
    },
    {
        className: "Kid's Art Class",
        priceId: 'price_1Rw6iv2cQ3M4p8Cs41Wyelxz',
        availableTimeSlots: [900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500, 1530, 1600],
        duration: 180 // minutes
    },
    {
        className: "Private Event",
        priceId: 'price_1Rw6jq2cQ3M4p8CslrM40Ejx',
        availableTimeSlots: [900, 930, 1000, 1030, 1100, 1130, 1200, 1230, 1300, 1330, 1400, 1430, 1500, 1530, 1600, 1630, 1700, 1730, 1800, 1830, 1900, 1930, 2000],
        duration: 240 // minutes
    }

]).catch(err => {
    if (err.code === 11000) {
        console.warn('Classes already exist, skipping creation.');
    } else {
        console.error('Error creating classes:', err);
    }
});


// Connect to MongoDB
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in the environment variables.");
}
mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected!");
    })
    .catch(err => console.error("Error connecting to MongoDB: ", err));

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
        Classes,
        webhookSecret: STRIPE_WEBHOOK_SECRET,
    })
);

// API router for other endpoints
app.use(
    '/api',
    createApiRouter({
        stripe,
        Booking,
        Classes,
        YOUR_DOMAIN,
    })
);

app.listen(4242, () => console.log('Running on port 4242'));