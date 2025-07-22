import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import Card from "@/components/card.tsx";

export default function Hero() {
    return (
        <>
            <div className="relative w-full h-150 overflow-hidden">
                <img src="/hero.jpg" alt="Hero Image" className="w-full h-full object-cover"/>
                <div
                    className="absolute top-1/2 -left-70 -translate-y-1/2 w-250 h-250 bg-[var(--main-blue)] opacity-80 rounded-full"/>
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
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Label className={"mt-16 pb-8 text-2xl md:text-3xl font-medium text-[var(--main-red)]"}>
                        Our Studio
                    </Label>
                    <Label className={"font-normal leading-normal"}>
                        lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                        labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
                        laboris nisi
                        ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
                        esse
                        cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                    </Label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center">
                    <Card title={"Book a Session"}
                          image={"public/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Book Now"}/>
                    <Card title={"About Us"}
                          image={"public/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Learn More"}/>
                    <Card title={"Classses & Services"}
                          image={"public/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Explore Classes"}/>
                </div>
            </div>
        </>
    );
}