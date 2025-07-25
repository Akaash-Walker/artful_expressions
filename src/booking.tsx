import Banner from "@/components/banner.tsx";
import Heading from "@/components/heading.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx";

export default function Booking() {
    return (
        <div>
            <Banner title={"Book a Session"} buttonText1={"Explore Classes"}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Choose Your Class"}/>
                    <Select>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="drawing">Drawing</SelectItem>
                            <SelectItem value="sculpting">Sculpting</SelectItem>
                            <SelectItem value="digital-art">Digital Art</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    )
}