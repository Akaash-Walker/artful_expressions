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
