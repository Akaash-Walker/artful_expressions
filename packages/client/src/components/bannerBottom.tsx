import {Label} from "./ui/label.tsx";

interface BannerProps {
    title: string;
    subtitle?: string;
}

export default function BannerBottom({title, subtitle}: BannerProps) {

    return (
        <div className="relative w-full min-h-80 md:h-150 overflow-hidden">
            <img src="/hero.jpg" alt="Hero Image" className="absolute inset-0 w-full h-full object-cover z-0"/>

            {/* Solid blue overlay - for mobile only */}
            <div className="md:hidden absolute inset-0 bg-[var(--main-blue)] opacity-70 z-10"/>

            {/* Circle container - for md screens and up */}
            <div
                className="hidden md:flex absolute bottom-0 left-1/2 translate-y-[89%] translate-x-[-50%] w-798 h-798 rounded-full flex-col items-center"
                style={{backgroundColor: 'rgba(83, 113, 255, 0.8)'}}
            >
                {/* Text container positioned within the top visible part of the circle */}
                <div className="relative mt-12 text-center w-4/5 max-w-2xl">
                    <Label className="text-white text-5xl md:text-7xl font-bold leading-tight">
                        {title}
                    </Label>
                    <div className="mt-4">
                        <Label className="text-white text-xl md:text-xl font-medium leading-tight mx-auto block">
                            {subtitle}
                        </Label>
                    </div>
                </div>
            </div>

            {/* Text for mobile view */}
            <div className="md:hidden absolute inset-0 z-20 flex items-center justify-center">
                <div className="text-center w-4/5 max-w-2xl">
                    <Label className="text-[var(--secondary-pale-blue)] text-5xl font-bold leading-tight">
                        {title}
                    </Label>
                    <div className="mt-4">
                        <Label className="text-[var(--secondary-pale-blue)] text-xl font-medium leading-tight mx-auto block">
                            {subtitle}
                        </Label>
                    </div>
                </div>
            </div>
        </div>
    );
}