import Hero from "@/components/Hero";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import BillsDashboard from "@/components/dashboard/BillsDashboard";


export default async function Home() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    if (!session.isLoggedIn) {
        redirect("/");
    }
    if (!session.isVerified) {
        redirect("/mfa");
    }

    return (
        <Dashboard>
            <BillsDashboard />
        </Dashboard>
    );
}
