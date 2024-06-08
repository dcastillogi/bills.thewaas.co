import Hero from "@/components/Hero"
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation'

export default async function Home() {
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);
    if (!session.isLoggedIn) {
        // If user is not logged in, display welcome message to bills platform
        return <Hero />
    }

    if (!session.isVerified) {
        redirect('/mfa')
    }

    // If user is logged in, display bills dashboard
    return (
        <div>
            <h1>Welcome to Bills</h1>
            <p>Manage your bills with ease</p>
        </div>
    )
}
