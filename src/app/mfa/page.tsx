import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OTP from "@/components/OTP";

export default async function Home() {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    if (!session.isLoggedIn) redirect("/");

    const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {

    }

    return (
        <main className="w-screen h-screen grid place-items-center">
            <OTP email={session.email!} />
        </main>
    );
}
