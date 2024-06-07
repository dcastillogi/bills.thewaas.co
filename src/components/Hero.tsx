import LoginButton from "./LoginButton";
import { Button } from "./ui/button";

const Hero = () => {
    return (
        <div className="w-full py-5 px-8 flex justify-between">
            <div></div>
            <div className="flex gap-3">
                <LoginButton />
                <Button variant="default" size="sm">
                    Contáctanos
                </Button>
            </div>
        </div>
    );
};

export default Hero;
