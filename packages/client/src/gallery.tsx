import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "./components/ui/carousel.tsx";
import {Card} from "./components/ui/card.tsx";
import Banner from "./components/banner.tsx";

import Autoplay from "embla-carousel-autoplay"
import Heading from "./components/heading.tsx";


export default function Gallery() {
    return (
        <div>
            <Banner title={"Gallery"}/>
            <div className={"text-center"}>
                <Heading title={"Featured"} className={"w-full justify-center text-center"}/>
            </div>
            <div className={"mb-24"}>
                <Carousel className="md:w-4/5 mx-auto" orientation={"horizontal"} plugins={[
                    Autoplay({
                        delay: 2000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                        playOnInit: true
                    }),
                ]}>
                    <CarouselContent>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"} alt="Featured image 1"/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"} alt="Featured image 2"/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"} alt="Featured image 3"/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"} alt="Featured image 4"/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/girlpaint.jpg"}/></Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
            <div className={"flex-grid w-4/5 lg:w-2/3 mx-auto mb-24"}>
                <Heading title={"More Images"}/>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                    {Array.from({ length: 12 }).map((_, idx) => (
                        <img
                            key={idx}
                            src={"/girlpaint.jpg"}
                            className="w-full h-auto rounded-lg mb-4"
                            alt={`Gallery test ${idx + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}