import Heading from "./components/heading.tsx";
import Map from "./components/map.tsx";
import BannerBottom from "./components/bannerBottom.tsx";
import {Label} from "./components/ui/label.tsx";
import TeamCard from "./components/teamCard.js";

export default function About() {
    return (
        <>
            {/* Top banner */}
            <BannerBottom title={"What is Artful Expressions?"}
                          subtitle={"A bit about us, our story, and our mission."}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Our Story"}/>
                    <Label className={"text-md leading-normal"}>
                        Founded in 2025, Artful Expressions is a vibrant studio dedicated to nurturing creativity and
                        artistic expression. Our mission is to provide a welcoming space for individuals of all ages to
                        explore their artistic potential through a variety of classes and services. From kids' birthday
                        parties to adult sip and paint sessions, we aim to inspire and empower our community through the
                        joy of art.
                    </Label>
                    <Heading title={"Our Mission"}/>
                    <Label className={"text-md leading-normal"}>
                        At Artful Expressions, our mission is to foster a love for art and creativity in a
                        supportive and inspiring environment. We believe that everyone has the potential to create and
                        express themselves through art. Our goal is to provide high-quality classes and services that
                        cater to all skill levels, from beginners to experienced artists. We are committed to making art
                        accessible and enjoyable for everyone, while also promoting personal growth and community
                        engagement through creative expression.
                    </Label>
                    <Heading title={"Meet the Team"}/>
                    <TeamCard name={"Akaash"} image={"girlpaint.jpg"}
                              bio={"My name is Akaash and I am currently a computer science student at WPI. I love helping others find their niche in art in a comfortable, safe learning space. In my free time, I like to play volleyball with my friends and also work on some personal coding project. In fact, I built this website!"}/>
                    <Heading title={"Find us!"}/>
                    <Map/>
                </div>
            </div>
        </>
    );
}