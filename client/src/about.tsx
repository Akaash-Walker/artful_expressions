import {Label} from "./components/ui/label.tsx";

export default function About() {
    return (
        <>
        {/* Top banner */}
            <div className="relative w-full h-150 overflow-hidden">
                <img src="/hero.jpg" alt="Hero Image" className="w-full h-full object-cover"/>
                {/* Circle container with text inside */}
                {/* absolutely awful way of doing this, but I gave up */}
                <div
                    className="absolute bottom-0 left-1/2 translate-y-[89%] translate-x-[-50%] w-798 h-798 rounded-full flex flex-col items-center"
                    style={{ backgroundColor: 'rgba(83, 113, 255, 0.8)' }}
                >
                    {/* Text container positioned within the top visible part of the circle */}
                    <div className="relative mt-12 text-center w-4/5 max-w-2xl">
                        <Label className="text-white text-5xl md:text-7xl font-bold leading-tight">
                            What is Artful Expressions?
                        </Label>
                        <div className="mt-4">
                            <Label className="text-white text-xl md:text-xl font-medium leading-tight">
                                A bit about us, our story, and our mission.
                            </Label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}