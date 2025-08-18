import {Label} from "./components/ui/label.tsx";
import Card from "./components/card.tsx";
import Banner from "./components/banner.tsx";
import Heading from "./components/heading.tsx";

export default function Hero() {
    return (
        <>
            {/* Top banner */}
            <Banner title={"Find Your Happy Place"} buttonText1={"Book a Session"} buttonText2={"Explore Classes"}
                    route1={"/booking"} route2={"/classes"}/>
            {/* Main page content */}
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Our Studio"}/>
                    <Label className={"font-normal text-md leading-normal"}>
                        Our studio is a vibrant space dedicated to nurturing creativity and artistic
                        expression. We offer a wide range of classes and services for all ages, from kids' birthday
                        parties, to adult sip and paint, to art classes to learn and improve. Our experienced
                        instructors are passionate about helping you discover your artistic potential in a supportive
                        and inspiring environment. Whether you're a beginner or an experienced artist, we have something
                        for everyone. Join us to unleash your creativity and have fun!
                    </Label>
                </div>
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 justify-items-center items-start content-start mx-auto max-w-6xl">
                    <Card title={"Book a Session"}
                          image={"/girlpaint.jpg"}
                          description={"Book a session with us to explore your creativity and have fun!"}
                          buttonText={"Book Now"}
                          route={"/booking"}
                    />
                    <Card title={"About Us"}
                          image={"/girlpaint.jpg"}
                          description={"Learn more about our studio, our mission, and our team."}
                          buttonText={"Learn More"}
                          route={"/about"}
                    />
                    <Card title={"Classes & Services"}
                          image={"/girlpaint.jpg"}
                          description={"View our range of classes and services designed for all ages."}
                          buttonText={"Explore Classes"}
                          route={"/classes"}
                    />
                </div>
            </div>
        </>
    );
}