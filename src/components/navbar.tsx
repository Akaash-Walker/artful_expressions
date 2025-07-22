import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Cart, GeoAlt, Person, List} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex items-center p-4 md:pl-16 md:pr-16 bg-white">
            <img className="mx-8 w-20 object-cover" src="/IconOnly_Transparent_NoBuffer.png" alt="Logo" onClick={() => navigate("/")}/>
            {/* Hamburger for small screens */}
            <button
                className="md:hidden ml-auto"
                onClick={() => setOpen(!open)}
                aria-label="Toggle menu"
            >
                <List size={32}/>
            </button>
            {/* Menu links */}
            <div className={`flex-1 ${open ? "block" : "hidden"} md:flex justify-between`}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 pl-4">
                    <Button variant="ghost" onClick={() => navigate("/about")}>About Us</Button>
                    <Button variant="ghost">Classes & Services</Button>
                    <Button variant="ghost">Booking</Button>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                    <Button variant="ghost"><GeoAlt/></Button>
                    <Button variant="ghost"><Person/></Button>
                    <Button variant="ghost"><Cart/></Button>
                </div>
            </div>
        </div>
    );
}