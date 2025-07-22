import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Navbar from "./components/navbar.tsx";
import Hero from "./hero.tsx";
import './main.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Footer from "@/components/footer.tsx";
import About from "@/about.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Hero/>}/>
                <Route path="/about" element={<About/>}/>
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
