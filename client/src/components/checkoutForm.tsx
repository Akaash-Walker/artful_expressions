import {useCallback} from "react";
import {loadStripe} from '@stripe/stripe-js';
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from '@stripe/react-stripe-js';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// This is your test secret API key.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

interface CheckoutFormProps {
    date: Date,
    time: number,
    className: string,
    paymentType: string
}

export default function CheckoutForm({date, time, className, paymentType}: CheckoutFormProps) {
    const fetchClientSecret = useCallback(async () => {
        // Create a Checkout Session
        // todo: need to change later from localhost to production URL
        const res = await fetch("http://localhost:4242/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                date, time, className, paymentType
            })
        });
        const data = await res.json();
        return data.clientSecret;
    }, [date, time, className, paymentType]);

    const options = {fetchClientSecret};

    return (
        <div id="checkout">
            <EmbeddedCheckoutProvider
                key={paymentType}
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout/>
            </EmbeddedCheckoutProvider>
        </div>
    )
}

