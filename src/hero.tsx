import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function Hero() {
    return (
        <>
            <div className="relative w-full h-150 overflow-hidden">
                <img src="/hero.jpg" alt="Hero Image" className="w-full h-full object-cover"/>
                <div
                    className="absolute top-1/2 -left-70 -translate-y-1/2 w-250 h-250 bg-blue-400 opacity-80 rounded-full"/>
                <div className="absolute top-1/2 left-16 -translate-y-1/2 z-10 w-125">
                    <div className={"space-y-8"}>
                        <Label className={"text-white text-5xl md:text-7xl font-bold leading-tight"}>
                            Find Your Happy Place
                        </Label>
                        <div className={"space-x-8"}>
                            <Button>
                                Book a Session
                            </Button>
                            <Button>
                                Explore Classes
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/*Change later with actual red color*/}
            <div className={"flex justify-center w-full h-screen"}>
                <div className={"w-1/2 space-y-8"}>
                    <Label className={"mt-16 text-2xl md:text-3xl font-medium text-red-500"}>
                        Our Studio
                    </Label>
                    <Label className={"font-normal leading-normal"}>
                        lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi
                        ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Label>
                </div>
            </div>
        </>
    );
}