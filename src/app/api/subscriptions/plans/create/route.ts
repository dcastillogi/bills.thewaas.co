import { verifyTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import ePayCo from "@/lib/epayco";

export const POST = async (req: Request) => {
    const {
        name,
        description,
        amount,
        currency,
        interval,
        interval_count,
        trial_days,
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
    const teams = db.collection("teams");
    const t = await teams.findOne({ _id: new ObjectId(team) });
    if (!t!.payments) {
        return new Response("Payments not configured", { status: 400 });
    }
    const plans = db.collection("plans");
    const p = await plans.insertOne({
        teamId: new ObjectId(team),
        name,
        description,
        amount: parseFloat(amount),
        currency,
        interval,
        intervalCount: parseInt(interval_count),
        trialDays: parseInt(trial_days),
        createdAt: new Date(),
    });
    const epayco = new ePayCo(t!.payments);
    const plan = await epayco.createPlan({
        name,
        description,
        amount,
        currency,
        interval,
        interval_count,
        trial_days,
        id_plan: p.insertedId.toString(),
    });

    if (!plan) {
        return new Response("Failed to create plan", { status: 500 });
    }

    return Response.json(plan);
};
