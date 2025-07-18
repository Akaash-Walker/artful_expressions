import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";

export default function Hero() {
    return (
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
    );
}