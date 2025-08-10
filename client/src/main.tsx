import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Navbar from "./components/navbar.tsx";
import Hero from "./hero.tsx";
import './main.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Footer from "./components/footer.tsx";
import About from "./about.tsx";
import Classes from "./classes.tsx";
import Booking from "./booking.tsx";
import Gallery from "./gallery.tsx";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './components/CheckoutForm';
import Return from "./components/Return.tsx";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

export default function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Hero/>}/>
                <Route path="/about" element={<About/>}/>
                <Route path="/classes" element={<Classes/>}/>
                <Route path="/booking" element={<Booking/>}/>
                <Route path="/gallery" element={<Gallery/>}/>
                <Route
                    path="/checkout"
                    element={
                        <Elements stripe={stripePromise}>
                            <CheckoutForm />
                        </Elements>
                    }
                />
                <Route path={"/return"} element={<Return/>} />
            </Routes>
            <Footer/>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
