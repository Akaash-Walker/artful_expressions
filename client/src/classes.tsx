import Banner from "./components/banner.tsx";
import Heading from "./components/heading.tsx";
import {Label} from "./components/ui/label.tsx";
import {Button} from "./components/ui/button.tsx";
import {useNavigate} from "react-router-dom";

export default function Classes() {
    const navigate = useNavigate();
    return (
        <div>
            <Banner title={"Classes & Services"}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <div className="space-y-4">
                        <Heading title={"Kids Birthday Party"} />
                        <Label className="font-normal leading-normal">
                            Celebrate your child's special day with a fun and creative birthday party at our studio! Our Kids Birthday Party package includes:
                        </Label>
                        <ul className="list-disc pl-5 mt-2">
                            <li>2-hour party session</li>
                            <li>Art supplies and materials</li>
                            <li>Dedicated party host</li>
                            <li>Customizable art activities</li>
                            <li>Refreshments available upon request</li>
                        </ul>
                        <Label className="font-normal leading-normal">
                            Book now to create unforgettable memories!
                        </Label>
                        <Button className="mt-2" onClick={() => navigate("/booking")}>
                            Book Now
                        </Button>
                    </div>
                    {/* Art Classes for Kids */}
                    <div className="space-y-4">
                        <Heading title={"Art Classes for Kids"} />
                        <Label className="font-normal leading-normal">
                            Our art classes for kids are designed to inspire creativity and imagination. We offer a variety of classes suitable for different age groups and skill levels:
                        </Label>
                        <ul className="list-disc pl-5 mt-2">
                            <li>Painting</li>
                            <li>Drawing</li>
                            <li>Sculpting</li>
                            <li>Digital Art</li>
                            <li>Mixed Media</li>
                        </ul>
                        <Label className="font-normal leading-normal">
                            Each class is led by experienced instructors who provide personalized guidance and support to help your child develop their artistic skills. Classes are available in both group and private settings.
                        </Label>
                        <Button className="mt-2" onClick={() => navigate("/booking")}>
                            Book Now
                        </Button>
                    </div>
                    {/* Art Classes for Adults */}
                    <div className="space-y-4">
                        <Heading title={"Art Classes for Adults"} />
                        <Label className="font-normal leading-normal">
                            Our art classes for adults cater to all skill levels, from beginners to advanced artists. Whether you're looking to explore a new medium or refine your existing skills, we have a class for you:
                        </Label>
                        <ul className="list-disc pl-5 mt-2">
                            <li>Oil Painting</li>
                            <li>Acrylic Painting</li>
                            <li>Watercolor Painting</li>
                            <li>Drawing and Sketching</li>
                            <li>Sculpting and Clay Modeling</li>
                            <li>Digital Art and Illustration</li>
                        </ul>
                        <Label className="font-normal leading-normal">
                            Our classes are designed to be flexible and accommodating, allowing you to learn at your own pace while receiving expert instruction. Join us to unleash your creativity and connect with fellow art enthusiasts!
                        </Label>
                        <Button className="mt-2" onClick={() => navigate("/booking")}>
                            Book Now
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}