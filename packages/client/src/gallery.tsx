import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "./components/ui/carousel.tsx";
import {Card} from "./components/ui/card.tsx";
import Banner from "./components/banner.tsx";

import Autoplay from "embla-carousel-autoplay"


export default function Gallery() {
    return (
        <div>
            <Banner title={"Gallery"}/>
            <div>
                <Carousel className="md:w-2/3 mx-auto" orientation={"horizontal"} plugins={[
                    Autoplay({
                        delay: 3000,
                        stopOnInteraction: false,
                        stopOnMouseEnter: true,
                        playOnInit: true
                    }),
                ]}>
                    <CarouselContent>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (1).jpg"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (1).avif"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (1).png"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (1).webp"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (2).avif"}/></Card>
                        </CarouselItem>
                        <CarouselItem className={"md:basis-1/3"}>
                            <Card className="p-8"><img src={"/stock_paintings/painting (2).jpg"}/></Card>
                        </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious/>
                    <CarouselNext/>
                </Carousel>
            </div>
        </div>
    )
}