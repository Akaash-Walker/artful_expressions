import {Label} from "./ui/label.tsx";
import {Button} from "./ui/button.tsx";

interface CardProps {
    title: string;
    description: string;
    image: string;
    buttonText: string;
}

export default function Card({title, description, image, buttonText}: CardProps) {
    return (
        <div
            className="w-full max-w-xs rounded overflow-hidden bg-[var(--secondary-pale-blue)] shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">
            <div className={"w-3/4 justify-center mx-auto"}>
                <img className="h-1/2 pt-10 object-contain rounded" src={image} alt={title}/>
                <div className="px-4 py-8">
                    <Label className="font-medium text-lg text-[var(--main-blue)] mb-2">{title}</Label>
                    <Label className={"font-normal text-[var(--secondary-gray)] leading-normal"}>{description}</Label>
                </div>
                <div className="pb-8 flex justify-center">
                    <Button>
                        {buttonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}