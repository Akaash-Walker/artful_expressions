import {Label} from "./ui/label.tsx";
import {Button} from "./ui/button.tsx";

interface BannerProps {
    title: string;
    subtitle?: string;
    buttonText1?: string;
    buttonText2?: string;
}

export default function Banner({title, subtitle, buttonText1, buttonText2}: BannerProps) {
    return <div className="relative w-full md:h-150 overflow-hidden">
        <img src="/hero.jpg" alt="Hero Image" className="w-full md:h-full md:object-cover"/>
        {/* Solid blue overlay */}
        <div className="md:hidden absolute inset-0 bg-[var(--main-blue)] opacity-70 pointer-events-none"/>
        {/* md screen blue circle */}
        <div
            className="hidden md:block absolute top-1/2 -left-70 -translate-y-1/2 w-250 h-250 bg-[var(--main-blue)] opacity-80 rounded-full"/>
        {/* Title and buttons */}
        <div
            className="absolute top-1/2 left-1/2 md:left-16 -translate-y-1/2 -translate-x-1/2 md:translate-x-0 z-10 md:w-150 w-3/4 flex flex-col space-y-8 text-center md:text-left items-center md:items-start">
            <Label className="text-[var(--secondary-pale-blue)] text-5xl md:text-8xl font-bold leading-tight">
                {title}
            </Label>
                <Label className="text-white text-xl md:text-xl font-medium leading-tight">
                    {subtitle}
                </Label>
            <div
                className="space-x-4 md:space-x-8 flex md:flex-row w-full md:w-auto items-center md:items-start justify-center md:justify-start"
            >
                {buttonText1 && (
                    <Button>
                        {buttonText1}
                    </Button>
                )}
                {buttonText2 && (
                    <Button>
                        {buttonText2}
                    </Button>
                )}
            </div>
        </div>
    </div>;
}