import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel.tsx";
import {Card} from "@/components/ui/card.tsx";
import Banner from "@/components/banner.tsx";

export default function Gallery() {
    return (
        <div>
            <Banner title={"Gallery"}/>
            <Carousel className="w-2/3 mx-auto">
                <CarouselContent>
                    <CarouselItem className={"basis-1/3"}>
                        <Card className="p-8"><img src={"/girlpaint.jpg"}/></Card>
                    </CarouselItem>
                    <CarouselItem className={"basis-1/3"}>

                        <Card className="p-8"><img src={"/hero.jpg"}/></Card>
                    </CarouselItem>
                    <CarouselItem className={"basis-1/3"}>
                        <Card className="p-8"><img src={"/FullLogo_Transparent_NoBuffer.png"}/></Card>
                    </CarouselItem>
                    <CarouselItem className={"basis-1/3"}>
                        <Card className="p-8"><img src={"/IconOnly_Transparent_NoBuffer.png"}/></Card>
                    </CarouselItem>
                </CarouselContent>
                <CarouselPrevious/>
                <CarouselNext/>
            </Carousel>
        </div>
    )
}