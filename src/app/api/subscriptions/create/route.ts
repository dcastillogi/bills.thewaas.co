import { verifyTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import moment from "moment-timezone";
import { ObjectId } from "mongodb";

export const POST = async (req: Request) => {
    const {
        contact,
        lang,
        email,
        start_date,
        plan,
        reference
    } = await req.json();

    const { session, userId } = await getSession();
    if (!session.isLoggedIn) {
        return new Response("Not logged in", { status: 401 });
    }

    const team = await verifyTeam(userId);
    if (!team) {
        return new Response("Team not found", { status: 404 });
    }

    const client = await clientPromise;
    const db = client.db("main");
    const subscriptions = db.collection("subscriptions");
    const momentDate = moment(start_date).startOf('day').tz('America/Bogota');
    const p = await subscriptions.insertOne({
        teamId: new ObjectId(team),
        contactId: new ObjectId(contact),
        lang,
        status: "created",
        email,
        startAt: momentDate.toDate(),
        day: momentDate.day(),
        planId: new ObjectId(plan),
        reference,
        createdAt: new Date(),
        logs: []
    });

    // TODO: Send email to start subscription

    return new Response("Subscription created");
}