import Hero from "@/components/Hero";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Dashboard from "@/components/Dashboard";
import BillsDashboard from "@/components/dashboard/BillsDashboard";

export default async function Home({ params }: { params: { team: string } }) {
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

    const team = await fetch(`${process.env.HOST}/api/team/get?id=${params.team}`, {
        cache: 'no-store',
        credentials: 'include'
    });
    
    if (!team.ok) notFound()

    return (
        <Dashboard>
            <BillsDashboard />
        </Dashboard>
    );
}
