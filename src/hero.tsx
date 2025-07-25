import {Label} from "@/components/ui/label.tsx";
import Card from "@/components/card.tsx";
import Banner from "@/components/banner.tsx";
import Heading from "@/components/heading.tsx";

export default function Hero() {
    return (
        <>
            {/* Top banner */}
            <Banner title={"Find Your Happy Place"} buttonText1={"Book a Session"} buttonText2={"Explore Classes"}/>
            {/* Main page content */}
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Our Studio"}/>
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
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center">
                    <Card title={"Book a Session"}
                          image={"/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Book Now"}/>
                    <Card title={"About Us"}
                          image={"/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Learn More"}/>
                    <Card title={"Classses & Services"}
                          image={"/girlpaint.jpg"}
                          description={"lorem ipsum dolor sit amet, consectetur adipiscing elit"}
                          buttonText={"Explore Classes"}/>
                </div>
            </div>
        </>
    );
}