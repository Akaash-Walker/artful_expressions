import {useEffect, useState} from "react";
import Banner from "./components/banner.tsx";
import Heading from "./components/heading.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "./components/ui/select.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "./components/ui/popover.tsx";
import {Button} from "./components/ui/button.tsx";
import {ChevronDownIcon} from "lucide-react";
// import {Calendar} from "./components/ui/calendar.tsx";
import {Label} from "./components/ui/label.tsx";
import CheckoutForm from "./components/checkoutForm.tsx";
import {Calendar} from "./components/ui/calendar.tsx";

export default function Booking() {
    // used for date menu popover
    const [open, setOpen] = useState(false);

    // function to format time from 24-hour to 12-hour format
    const formatTime = (t: number) => {
        const hour = Math.floor(t / 100);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = ((hour + 11) % 12) + 1;
        return `${displayHour}:00 ${suffix}`;
    };

    // Define the class info interface (same as classes schema in db)
    interface ClassInfo {
        className: string;
        priceId: string;
        availableTimeSlots: number[];
        duration: number;
    }

    // all needed to show total
    const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<number | undefined>(undefined);
    const [bookedTimes, setBookedTimes] = useState<number[]>([]);
    const [paymentType, setPaymentType] = useState<string | undefined>(undefined);
    const [numAttendees, setNumAttendees] = useState<number>(1);
    const [timesLoading, setTimesLoading] = useState<boolean>(false);
    const [classesLoading, setClassesLoading] = useState<boolean>(true);
    const [classObjs, setClassObjs] = useState<ClassInfo[]>([]);

    // Fetch available dates from the server
    useEffect(() => {
        if (!date) return;

        // Reset time and booked times when date changes
        setTime(undefined);

        const controller = new AbortController();
        setTimesLoading(true);
        // normalize date to midnight
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const classParam = selectedClass ? `&className=${encodeURIComponent(selectedClass)}` : "";
        fetch(`http://localhost:4242/api/bookings?date=${date.toISOString()}${classParam}`, { signal: controller.signal })
            .then(res => res.json())
            .then(data => {
                setBookedTimes(data);
                // if selected time just became booked, clear it
                setTime(prev => (prev != null && data.includes(prev)) ? undefined : prev);
            })
            .catch(err => {
                if (err.name !== 'AbortError') console.error(err);
            })
            .finally(() => setTimesLoading(false));
        return () => controller.abort();
    }, [date, selectedClass]);

    // clear selected time when class changes
    useEffect (() => {
        setTime(undefined);
    }, [selectedClass]);

    // runs once on mount to fetch class objs
    useEffect(() => {
        const controller = new AbortController();

        fetch("http://localhost:4242/api/classes", {signal: controller.signal})
            .then((res) => {
                if (!res.ok) throw new Error(`Failed to fetch classes: ${res.status}`);
                return res.json();
            })
            .then((data: ClassInfo[]) => {
                setClassObjs(data);
                setClassesLoading(false); // only on success
            })
            .catch((err) => {
                if (err.name !== "AbortError") console.error("Error fetching classes:", err);
            });

        return () => controller.abort();
    }, []);

    return (
        <div>
            <Banner title={"Book a Session"} buttonText1={"Explore Classes"} route1={"/classes"}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Choose Your Class"}/>
                    {/* Class picker */}
                    <Select onValueChange={setSelectedClass} disabled={classesLoading}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder={classesLoading ? "Loading..." : "Select a class"}/>
                        </SelectTrigger>
                        <SelectContent>
                            {/* getting the class objects and extracting the class names*/}
                            {classObjs.map((cls) => (
                                <SelectItem key={cls.className} value={cls.className}>
                                    {cls.className}
                                </SelectItem>
                            ))}
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
                                            onSelect={(date: Date | undefined) => {
                                                setDate(date)
                                                setOpen(false)
                                            }}
                                            // disable past dates, can change threshold
                                            disabled={(date: Date) => date < new Date()}
                                        />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Time picker */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="time-picker" className="px-1">
                                Time
                            </Label>
                            <Select
                                key={date ? date.toDateString() : "no-date"}
                                value={time != null ? String(time) : ""}
                                onValueChange={(value: string) => setTime(Number(value))}
                                disabled={timesLoading || !date || !selectedClass}
                            >
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder={timesLoading ? "Loading..." : "Select time"}/>
                                </SelectTrigger>
                                <SelectContent>
                                    {classObjs.map((cls) => (
                                        cls.className === selectedClass && cls.availableTimeSlots.map((slot) => {
                                            const isBooked = bookedTimes.includes(slot);
                                            return (
                                                <SelectItem
                                                    key={slot}
                                                    value={String(slot)}
                                                    disabled={timesLoading || isBooked}
                                                >
                                                    {formatTime(slot)} {isBooked ? '(Booked)' : ''}
                                                </SelectItem>
                                            );
                                        })
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Heading title={"Number of Attendees"}/>
                    <div>
                        <Button variant={"outline"} onClick={() => setNumAttendees(Math.max(1, numAttendees - 1))}>
                            -
                        </Button>
                        <span className="px-4">{numAttendees}</span>
                        <Button variant={"outline"} onClick={() => setNumAttendees(Math.min(30, numAttendees + 1))}>
                            +
                        </Button>
                    </div>
                    <Heading title={"Pay in full or deposit"}/>
                    <Select onValueChange={setPaymentType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment option"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full">Pay in full</SelectItem>
                            <SelectItem value="deposit">Pay deposit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {selectedClass && date && time && paymentType &&
                <CheckoutForm paymentType={paymentType} className={selectedClass} date={date} time={time}
                              numAttendees={numAttendees}/>
            }
        </div>
    )
}