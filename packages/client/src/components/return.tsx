import {useEffect, useState} from "react";
import {Navigate} from "react-router-dom";
import Heading from "./heading.tsx";
import {Label} from "./ui/label.tsx";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4242";

export default function Return() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        // todo: need to change later from localhost to production URL
        fetch(`${VITE_BACKEND_URL}/api/session-status?session_id=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return (
            <Navigate to="/checkout" />
        )
    }

    if (status === 'complete') {
        return (
            <div>
                <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                    <div className={"lg:w-4/5 mx-auto"}>
                        <Heading title={"Booking Confirmed!"}/>
                        <Label className={"font-normal leading-normal"}>
                            Thank you for booking with us! Your session has been confirmed.
                            A confirmation email has been sent to {customerEmail}.
                        </Label>
                    </div>
                </div>
            </div>
        )
    }

    return null;
}