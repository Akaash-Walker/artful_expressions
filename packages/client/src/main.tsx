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
import Return from "./components/return.tsx";
import "leaflet/dist/leaflet.css";
import NotFound from "./notFound.js";

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
                <Route path={"/return"} element={<Return/>} />
                <Route path="*" element={<NotFound/>}/>
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
