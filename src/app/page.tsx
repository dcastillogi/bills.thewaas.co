import Hero from "@/components/Hero";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    if (session.isLoggedIn) {
        if (session.isVerified) {
            redirect(`/${session.defaultTeam!}`)
        } else {
            redirect("/mfa");
        }
    }

    return <Hero />;
}
