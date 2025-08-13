import Banner from "./components/banner.tsx";
import Heading from "./components/heading.tsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./components/ui/select.tsx";
import { Popover, PopoverContent, PopoverTrigger } from "./components/ui/popover.tsx";
import { Button } from "./components/ui/button.tsx";
import { ChevronDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Calendar } from "./components/ui/calendar.tsx";
import { Label } from "./components/ui/label.tsx";
import CheckoutForm from "./components/checkoutForm.tsx";

export default function Booking() {
    // used for date menu popover
    const [open, setOpen] = useState(false);

    // time slots available for booking
    const TIME_SLOTS = [1000, 1100, 1200, 1300, 1400, 1500, 1600];

    // function to format time from 24-hour to 12-hour format
    const formatTime = (t: number) => {
        const hour = Math.floor(t / 100);
        const suffix = hour >= 12 ? 'PM' : 'AM';
        const displayHour = ((hour + 11) % 12) + 1;
        return `${displayHour}:00 ${suffix}`;
    };

    // all needed to show total
    const [selectedClass, setSelectedClass] = useState<string | undefined>(undefined);
    const [date, setDate] = useState<Date | undefined>(undefined);
    const [time, setTime] = useState<number | undefined>(undefined);
    const [bookedTimes, setBookedTimes] = useState<number[]>([]);
    const [paymentType, setPaymentType] = useState<string | undefined>(undefined);
    const [numAttendees, setNumAttendees] = useState<number>(1);
    const [timesLoading, setTimesLoading] = useState<boolean>(false);

    // Fetch available dates from the server
    useEffect(() => {
        if (!date) {
            setBookedTimes([]);
            return;
        }

        const controller = new AbortController();
        setTimesLoading(true);
        // normalize date to midnight
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        fetch(`http://localhost:4242/api/bookings?date=${date}`)
            .then(res => res.json())
            .then(data => {
                setBookedTimes(data);
                // if selected time just became booked, clear it
                setTime(prev => prev && data.includes(prev) ? undefined : prev);
            })
            .catch(err => {
                if (err.name !== 'AbortError') console.error(err);
            })
            .finally(() => setTimesLoading(false));
        return () => controller.abort();
    }, [date]);

    return (
        <div>
            <Banner title={"Book a Session"} buttonText1={"Explore Classes"} route1={"/classes"} />
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <Heading title={"Choose Your Class"} />
                    <Select onValueChange={setSelectedClass}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="drawing">Drawing</SelectItem>
                            <SelectItem value="sculpting">Sculpting</SelectItem>
                            <SelectItem value="digital-art">Digital Art</SelectItem>
                        </SelectContent>
                    </Select>
                    <Heading title={"Choose a Date"} />
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
                                        <ChevronDownIcon />
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
                                        // disable past dates, can change threshold
                                        disabled={(date) => date < new Date()}
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        {/* Time picker */}
                        <div className="flex flex-col gap-3">
                            <Label htmlFor="time-picker" className="px-1">
                                Time
                            </Label>
                            <Select onValueChange={(value) => {
                                if (timesLoading) return;
                                setTime(Number(value));
                            }} disabled={timesLoading || !date}>
                                <SelectTrigger className="w-32">
                                    <SelectValue placeholder={timesLoading ? "Loading..." : "Select time"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIME_SLOTS.map(slot => {
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
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Heading title={"Number of Attendees"} />
                    <div>
                        <Button variant={"outline"} onClick={() => setNumAttendees(Math.max(1, numAttendees - 1))}>
                            -
                        </Button>
                        <span className="px-4">{numAttendees}</span>
                        <Button variant={"outline"} onClick={() => setNumAttendees(Math.min(30, numAttendees + 1))}>
                            +
                        </Button>
                    </div>
                    <Heading title={"Pay in full or deposit"} />
                    <Select onValueChange={setPaymentType}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select payment option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="full">Pay in full</SelectItem>
                            <SelectItem value="deposit">Pay deposit</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            {selectedClass && date && time && paymentType &&
                <CheckoutForm paymentType={paymentType} className={selectedClass} date={date} time={time} numAttendees={numAttendees} />
            }
        </div>
    )
}