import {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import {Cart, GeoAlt, Person, List, X} from "react-bootstrap-icons";
import {useNavigate} from "react-router-dom";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex items-center p-4 md:pl-16 md:pr-16 bg-white">
            <img className="md:mx-8 w-20 object-cover" src="/IconOnly_Transparent_NoBuffer.png" alt="Logo"
                 onClick={() => navigate("/")}/>
            {/* Hamburger for small screens */}
            <button
                className="md:hidden ml-auto"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
            >
                <List size={32}/>
            </button>
            {/* Menu links for desktop */}
            <div className="flex-1 hidden md:flex justify-between">
                <div className="flex flex-row space-x-4 pl-4">
                    <Button variant="ghost" onClick={() => navigate("/about")}>About Us</Button>
                    <Button variant="ghost" onClick={() => navigate("/classes")}>Classes & Services</Button>
                    <Button variant="ghost" onClick={() => navigate("/booking")}>Booking</Button>
                    <Button variant="ghost" onClick={() => navigate("/gallery")}>Gallery</Button>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        onClick={() =>
                            window.location.href =
                                "https://www.google.com/maps/place/127+Rockingham+Rd+%2318,+Derry,+NH+03038/@42.8760664,-71.3023846,17z/data=!3m1!4b1!4m6!3m5!1s0x89e25370039aaaab:0xbeabc00a025e8408!8m2!3d42.8760625!4d-71.2998097!16s%2Fg%2F11rnf9v2sy?entry=ttu&g_ep=EgoyMDI1MDcyMS4wIKXMDSoASAFQAw%3D%3D"
                        }
                    >
                        <GeoAlt/>
                    </Button>
                    <Button variant="ghost"><Person/></Button>
                    <Button variant="ghost"><Cart/></Button>
                </div>
            </div>
            {/* Fullscreen mobile menu overlay */}
            {open && (
                <div className="fixed inset-0 bg-white z-50 flex flex-col">
                    <button
                        className="absolute top-4 right-4"
                        onClick={() => setOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={32}/>
                    </button>
                    <div className="flex flex-col items-start flex-1 space-y-8 mt-14 text-2xl">
                        <Button variant={"ghost"} className={"w-full justify-start"} onClick={() => {
                            setOpen(false);
                            navigate("/");
                        }}>
                            Home
                        </Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                            setOpen(false);
                            navigate("/about");
                        }}>About Us</Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                            setOpen(false);
                            navigate("/classes");
                        }}>Classes & Services</Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                            setOpen(false);
                            navigate("/booking");
                        }}>Booking</Button>
                        <Button variant="ghost" className="w-full justify-start" onClick={() => {
                            setOpen(false);
                            navigate("/gallery");
                        }}>Gallery</Button>
                        <Button variant="ghost" className="w-full justify-start">Location</Button>
                        <Button variant="ghost" className="w-full justify-start">Account</Button>
                        <Button variant="ghost" className="w-full justify-start">Cart</Button>
                    </div>
                </div>
            )}
        </div>
    );
}