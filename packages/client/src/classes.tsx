import Banner from "./components/banner.tsx";
import ClassCard from "./components/classCard.tsx";

export default function Classes() {
    return (
        <div>
            <Banner title={"Classes & Services"}/>
            <div className="w-4/5 lg:w-2/3 mx-auto space-y-8 mb-24">
                <div className={"lg:w-4/5 mx-auto"}>
                    <ClassCard title={"Kid's Birthday Party"} description1={"Celebrate your child's special day with a fun and creative birthday party at our studio! Our birthday party packages include:\n"}
                                 features={["2-hour party duration", "Art supplies provided", "Party decorations", "Dedicated party host", "Customizable art activities"]}
                                    description2={"We can accommodate up to 15 children per party. Our team will handle all the details, so you can relax and enjoy the celebration with your child and their friends."}/>

                    <ClassCard title={"Kid's Art Class"}
                               description1={"Our art classes for kids are designed to inspire creativity and imagination. We offer a variety of classes suitable for different age groups and skill levels:\n"}
                                 features={["1-hour painting session", "Painting", "Drawing", "Sculpting", "Digital Art", "Mixed Media"]}
                                 description2={"Each class is led by experienced instructors who provide personalized guidance and support to help your child develop their artistic skills. Classes are available in both group and private settings."}/>
                    <ClassCard title={"Sip & Paint"} description1={"Unleash your inner artist with our Sip & Paint events! Perfect for a fun night out with friends or a unique date night, our Sip & Paint sessions include:\n"}
                                 features={["3-hour painting session", "All art supplies provided", "Guided instruction", "BYOB (We cannot serve you any drinks, but feel free to bring your own!)", "Relaxed and fun atmosphere"]}
                                 description2={"No prior painting experience is required! Our talented instructors will guide you step-by-step through the painting process, ensuring you leave with a masterpiece of your own."}/>
                </div>
            </div>
        </div>
    )
}