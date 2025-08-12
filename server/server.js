import dotenv from 'dotenv';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

dotenv.config({path: './server/.env'});

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());

const YOUR_DOMAIN = 'http://localhost:5173';

const PRICE_MAP = {
    full: 'price_1RvD8b2cQ3M4p8Cs2oo900Rj',
    deposit: "price_1RuGZw2cQ3M4p8CsV9wwyZQl"
}

/* Below are the routes, may need to move a separate file if more are added */
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
    });

    res.json({clientSecret: session.client_secret});
});

app.get('/session-status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

    res.send({
        status: session.status,
        customer_email: session.customer_details.email
    });
});

app.listen(4242, () => console.log('Running on port 4242'));