import Hero from "@/components/Hero";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import { Button } from "@/components/ui/button";
import { CalendarDateRangePicker } from "@/components/dashboard/CalendarDateRangePicker";

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
            <div className="w-full px-4 border-b py-3 flex items-center justify-between">
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
            <div className="border-x max-w-8xl mx-auto w-full h-screen flex">
                <div className="h-full border-r w-[25%] min-w-[350px]"></div>
                <div className="h-full flex-grow overflow-x-auto">
                    <div className="min-w-[800px]"></div>
                </div>
            </div>
        </Dashboard>
    );
}
