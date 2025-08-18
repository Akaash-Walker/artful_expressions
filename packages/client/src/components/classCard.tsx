import Heading from "./heading.tsx";
import {Label} from "./ui/label.tsx";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";

interface ClassCardProps {
    title: string;
    description1: string;
    features?: string[];
    description2?: string;
}

export default function ClassCard({title, description1, features, description2}: ClassCardProps) {
    const navigate = useNavigate();
    return (
        <div className="space-y-4">
            <Heading title={title}/>
            <Label className="text-md font-normal leading-normal">
                {description1}
            </Label>
            <ul className="list-disc pl-5 mt-2">
                {features?.map((feature, index) => (
                    <li key={index}>{feature}</li>
                ))}
            </ul>
            <Label className="text-md font-normal leading-normal">
                {description2}
            </Label>
            <Button className="mt-2" onClick={() => navigate("/bookings")}>
                Book Now
            </Button>
        </div>
    )
}