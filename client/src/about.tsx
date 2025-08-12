import Heading from "./components/heading.tsx";
import Map from "./components/map.tsx";
import BannerBottom from "./components/bannerBottom.tsx";

export default function About() {
    return (
        <>
            {/* Top banner */}
            <BannerBottom title={"What is Artful Expressions?"} subtitle={"A bit about us, our story, and our mission."}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Find us!"}/>
                    <Map/>
                </div>
            </div>
        </>
    );
}