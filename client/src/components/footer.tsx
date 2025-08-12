import {Label} from "./ui/label.tsx";

export default function Footer() {
    return (
        <>
            <div className="w-full bg-[var(--secondary-soft-warm-beige)] py-16 px-4">
                <div
                    className="flex flex-col md:flex-row items-start md:items-center w-full gap-y-8 md:gap-x-32 justify-center">
                    <div className="mb-4 md:mb-0 ">
                        <img src="/FullLogo_Transparent_NoBuffer.png" className="h-24 md:h-36 object-contain"
                             alt="Artful Expressions Logo"/>
                    </div>
                    <div className="flex flex-col md:flex-row md:flex-wrap gap-y-8 md:ml-8 md:gap-x-16">
                        <div className="flex flex-col space-y-2 leading-12 font-medium">
                            <a href="/about">About Us</a>
                            <a href="/classes">Classes & Services</a>
                            <a href="">Schedule & Calendar</a>
                        </div>
                        <div className="flex flex-col space-y-2 leading-12 font-medium">
                            <a href="/booking">Booking</a>
                            <a href="">Private Events</a>
                        </div>
                        <div className="w-px h-64 bg-[var(--secondary-gray)] mx-8 hidden lg:block"/>
                        <div className="flex flex-col space-y-2 leading-12 font-medium">
                            <a href="">Contact Us</a>
                            <a href="/gallery">Gallery</a>
                            <a href="">FAQ</a>
                            <a href="">Blog</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className={"justify-center flex items-center bg-[var(--secondary-soft-warm-beige)] py-4"}>
                <div className={"flex flex-col"}>
                    <Label>&copy; Artful Expressions 2025. All rights reserved.</Label>
                </div>
            </div>
        </>
    );
}