import {Button} from "@/components/ui/button.tsx";
import {Cart, GeoAlt, Person} from "react-bootstrap-icons";

export default function Navbar() {
    return (
        <div className="flex items-center p-4">
            <img className={"pl-4"} src="/IconOnly_Transparent_NoBuffer.png" alt="Logo" width="75" height="75"/>
            <div className="flex flex-1 justify-between">
                <div className="flex space-x-4 pl-4">
                    <Button variant={"ghost"}>About Us</Button>
                    <Button variant={"ghost"}>Classes & Services</Button>
                    <Button variant={"ghost"}>Booking</Button>
                </div>
                <div>
                    <Button variant={"ghost"}><GeoAlt/></Button>
                    <Button variant={"ghost"}><Person/></Button>
                    <Button variant={"ghost"}><Cart/></Button>
                </div>
            </div>
        </div>
    );
}