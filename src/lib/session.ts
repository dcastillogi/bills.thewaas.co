import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "./iron-session";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function getSession(verify = true) {
    const session = await getIronSession<SessionData>(
        cookies(),
        sessionOptions
    );
    if (verify && session.isLoggedIn) {
        const client = await clientPromise;
        const db = await client.db("main");
        const sessions = await db.collection("sessions");
        const data = await sessions.findOne({ _id: new ObjectId(session.session) });
        if (!data) {
            session.destroy();
            return {session};
        }
        if (data.expiresAt < new Date()) {
            session.destroy();
            return {session};
        }

        return {session, userId: data.userId};
    }
    return {session};
}
