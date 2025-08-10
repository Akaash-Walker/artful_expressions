import 'dotenv/config';
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';

const stripe = new Stripe(process.env.VITE_STRIPE_SECRET_KEY);
const app = express();
app.use(cors());


const YOUR_DOMAIN = 'http://localhost:5173';

app.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        ui_mode: 'embedded',
        line_items: [
            {
                // Provide the exact Price ID (for example, price_1234) of the product you want to sell
                price: 'price_1RtRtg2cQ3M4p8CsvTP7yy5A',
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