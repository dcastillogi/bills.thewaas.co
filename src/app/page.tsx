import Hero from "@/components/Hero";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/CalendarDateRangePicker";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Home() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    if (!session.isLoggedIn) {
        // If user is not logged in, display welcome message to bills platform
        return <Hero />;
    }

    if (!session.isVerified) {
        redirect("/mfa");
    }

    // If user is logged in, display bills dashboard
    return (
        <Dashboard>
            <div className="w-full px-4 border-b py-3 flex items-center justify-between bg-muted/40">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Facturas
                    </h2>
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <CalendarDateRangePicker />
                    <Button>Crear</Button>
                </div>
            </div>
            <div className="border-x max-w-8xl mx-auto w-full h-[calc(100vh-130px)] flex">
                <table className="h-full border-r w-[25%] min-w-[400px] text-sm">
                    <tbody>
                        <tr className="flex py-4 px-3 border-b w-full text-left hover:bg-secondary/80 cursor-pointer">
                            <td className="flex-grow">
                                <div className="flex gap-2 items-center">
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage
                                                        src="https://github.com/shadcn.png"
                                                        alt="Daniel Castillo"
                                                    />
                                                    <AvatarFallback className="text-xs">
                                                        DC
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Daniel Castillo</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                    <div>
                                        <h3 className="font-semibold">
                                        clx5numem000008l0hqys2181
                                        </h3>
                                        <div className="flex gap-0.5 items-center">
                                            <p>12 Mayo, 2024</p>
                                            <Badge className="text-[11px] leading-3 px-1.5 bg-success-background text-success hover:text-success hover:bg-success-background">
                                                Paid
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="w-auto">
                                <h4 className="font-semibold">Total Due</h4>
                                <div className="flex">
                                    <p>$580.000</p>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className="h-full flex-grow overflow-x-auto">
                    <iframe src="/bill/asd" className="min-w-[800px] h-full w-full mt-6"></iframe>
                </div>
            </div>
        </Dashboard>
    );
}
