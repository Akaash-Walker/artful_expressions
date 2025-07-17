import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import Navbar from "./components/navbar.tsx";
import Hero from "./hero.tsx";
import './main.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";

export default function App() {
    return (
        <BrowserRouter>
            <Navbar/>
            <Routes>
                <Route path="/" element={<Hero/>}/>
                {/* Add more routes here as needed */}
            </Routes>
        </BrowserRouter>
    );
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App/>
    </StrictMode>,
)
