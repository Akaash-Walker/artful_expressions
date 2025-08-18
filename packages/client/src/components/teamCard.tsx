import {Label} from "./ui/label.tsx";

interface TeamCardProps {
    name: string;
    image: string;
    bio: string;
}

export default function TeamCard({name, image, bio}: TeamCardProps) {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between space-y-8 md:space-y-0 md:space-x-16">
            <div className="md:w-48 h-64 overflow-hidden flex items-center justify-center rounded-sm">
                <img className="w-full h-full object-cover" src={image} alt="" />
            </div>
            <div className="flex-2 pl-4">
                <h3 className="text-2xl font-semibold text-[var(--main-blue)] mb-8">
                    {name}
                </h3>
                <Label className={"font-normal leading-normal text-md"}>
                    {bio}
                </Label>
            </div>
        </div>
    );
}