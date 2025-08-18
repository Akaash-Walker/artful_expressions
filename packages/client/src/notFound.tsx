import {Label} from "./components/ui/label.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "./components/ui/button.tsx";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <Label className={"text-4xl font-bold text-[var(--main-red)] mb-4"}>404 - Page Not Found</Label>
            <Label className="text-lg mb-8">The page you are looking for does not exist.</Label>
            <Button
                onClick={() => navigate('/')}
            >
                Go to Home
            </Button>
        </div>
    );
}