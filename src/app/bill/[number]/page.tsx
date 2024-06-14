"use client";

import Bill from "@/components/dashboard/bills/Bill";
import { Button } from "@/components/ui/button";
import { Loader2, PenLine } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useRef, useState } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import SignVerify from "@/components/SignVerify";

const SignBillPage = () => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showSignButton, setShowSignButton] = useState(true);
    const hCaptchaRef = useRef<HCaptcha | null>(null);
    const show = async () => {
        setLoading(true);
        await hCaptchaRef.current?.execute();
    };
    const pathname = usePathname();
    const { toast } = useToast();
    const generateCode = async (token: string) => {
        setLoading(true);
        const response = await fetch(
            `/api/bill/sign?token=${token}&bill=${pathname.split("/").pop()}`
        );
        if (!response.ok) {
            setLoading(false);
            return toast({
                title: "Oh oh! Algo salió mal",
                description:
                    "Hubo un error al enviar el código de verificación",
            });
        }
        setLoading(false);
        setOpen(true);
    };
    return (
        <div className="max-w-4xl px-6 mx-auto py-6">
            {
                /*
<ScrollArea className="border rounded-lg mt-6 w-full">
                <Bill />
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
                */
            }
            <iframe src={`/api/bill/${pathname.split("/").pop()}`} className="w-full aspect-[1.141] border rounded-lg mt-6 overflow-hidden"></iframe>
            {showSignButton && (
                <Button
                    className="w-full mt-6"
                    disabled={loading}
                    onClick={show}
                >
                    {loading ? (
                        <>
                            <Loader2 className="inline mr-2 w-4 h-4 animate-spin" />{" "}
                            Cargando
                        </>
                    ) : (
                        <>
                            <PenLine className="inline mr-2 w-4 h-4" /> Firmar
                        </>
                    )}
                </Button>
            )}

            <Dialog open={open} onOpenChange={setOpen}>
                <SignVerify billId={pathname.split("/").pop() as string} close={() => setOpen(false)} hideButton={() => setShowSignButton(false)} />
            </Dialog>
            <HCaptcha
                sitekey="d94e78ec-a5ee-4204-adca-376cfa3ac354"
                ref={hCaptchaRef}
                size="invisible"
                loadAsync={false}
                onOpen={() => setLoading(false)}
                onVerify={generateCode}
            />
        </div>
    );
};

export default SignBillPage;
