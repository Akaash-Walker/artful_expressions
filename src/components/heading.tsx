import {Label} from "@/components/ui/label.tsx";

interface HeadingProps {
    title: string;
}

export default function Heading({title}: HeadingProps) {
    return (
        <Label className={"mt-16 pb-8 text-2xl md:text-3xl font-medium text-[var(--main-red)]"}>
            {title}
        </Label>
    )
}