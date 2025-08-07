import Banner from "@/components/banner.tsx";
import Heading from "@/components/heading.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ChevronDownIcon} from "lucide-react";
import {useState} from "react";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Label} from "@/components/ui/label.tsx";

export default function Booking() {
    const [open, setOpen] = useState(false);

    // all needed to show total
    const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<string | undefined>(undefined);


    return (
        <div>
            <Banner title={"Book a Session"} buttonText1={"Explore Classes"}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Choose Your Class"}/>
                    <Select onValueChange={setSelectedClass}>
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
                    <Heading title={"Choose a Date"}/>
                    <div className="flex gap-4">
                        {/* Date picker */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="date-picker" className="px-1">
                                Date
                            </Label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        id="date-picker"
                                        className="w-32 justify-between font-normal"
                                    >
                                        {date ? date.toLocaleDateString("en-US", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }) : "Select date"}
                                        <ChevronDownIcon/>
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                            setDate(date)
                                            setOpen(false)
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Time picker */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="time-picker" className="px-1">
                                Time
                            </Label>
                            <Select onValueChange={setTime}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder="Select time"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="10:00">10:00 AM</SelectItem>
                                    <SelectItem value="11:00">11:00 AM</SelectItem>
                                    <SelectItem value="12:00">12:00 PM</SelectItem>
                                    <SelectItem value="1:00">1:00 PM</SelectItem>
                                    <SelectItem value="2:00">2:00 PM</SelectItem>
                                    <SelectItem value="3:00">3:00 PM</SelectItem>
                                    <SelectItem value="4:00">4:00 PM</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    {selectedClass && date && time &&
                        <div>
                            <Heading title={"Total"}/>
                            <div className="text-2xl font-bold mt-2">$50.00</div>
                            <Button className="mt-4 w-full" onClick={() => alert("Send to Stripe...")}>
                                Place a Deposit with Stripe
                            </Button>
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}