import { verifyTeam } from "@/lib/actions";
import { encrypt } from "@/lib/cipher";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";

export const POST = async (req: Request) => {
    const { public_key, private_key } = await req.json();

    const { session, userId } = await getSession();
    if (!session) {
        return new Response("Not logged in", { status: 401 });
    }

    const team = await verifyTeam(userId);
    if (!team) {
        return new Response("Team not found", { status: 404 });
    }

    const client = await clientPromise;
    const db = client.db("main");
    const teams = db.collection("teams");
    teams.updateOne(
        { _id: new ObjectId(team) },
        {
            $set: {
                payments: {
                    provider: "ePayCo",
                    public_key,
                    private_key: encrypt(private_key),
                },
            },
        }
    );

    return new Response("OK", { status: 200 });
};
