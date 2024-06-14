import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OTP from "@/components/OTP";

export const metadata = {
    title: "Código de Verificación - Billing"
};

export default async function Home() {
    const session = await getIronSession<SessionData>(
        cookies() as any,
        sessionOptions
    );
    if (!session.isLoggedIn) redirect("/");
    if (session.isVerified) redirect(session.defaultTeam!);

    return (
        <main className="w-screen h-screen grid place-items-center">
            <OTP email={session.email!} />
        </main>
    );
}
