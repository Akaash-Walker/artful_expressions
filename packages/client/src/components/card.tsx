import {Label} from "./ui/label.tsx";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import { AspectRatio } from "./ui/aspect-ratio.tsx";

interface CardProps {
    title: string;
    description: string;
    image: string;
    buttonText: string;
    route?: string;
}

export default function Card({title, description, image, buttonText, route}: CardProps) {
    const navigate = useNavigate();

    if (!route) {
        route = "/"; // defaulting to home if no route is provided
    }

    return (
        <div
            className="w-full max-w-xs h-full rounded overflow-hidden bg-[var(--secondary-pale-blue)] shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300 flex flex-col">
            <div className={"w-3/4 justify-center mx-auto flex flex-col h-full min-h-0"}>
                {/* Image */}
                <div className="pt-10 shrink-0">
                    <AspectRatio ratio={4 / 3}>
                        <img className="w-full h-full object-cover rounded" src={image} alt={title}/>
                    </AspectRatio>
                </div>
                {/* Content */}
                <div className="px-4 py-8 flex-1">
                    <Label className="font-medium text-lg text-[var(--main-blue)] mb-2">{title}</Label>
                    <Label className={"font-normal text-[var(--secondary-gray)] leading-normal"}>{description}</Label>
                </div>
                {/* Actions */}
                <div className="pb-8 flex justify-center mt-auto">
                    <Button onClick={() => navigate(route)}>
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}