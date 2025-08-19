import {Label} from "./ui/label.tsx";

interface HeadingProps {
    title: string;
    className?: string;
}

export default function Heading({title, className}: HeadingProps) {
    return (
        <Label className={"mt-16 pb-8 text-2xl md:text-3xl font-medium text-[var(--main-red)] " + (className ?? "") }>
            {title}
        </Label>
    )
}