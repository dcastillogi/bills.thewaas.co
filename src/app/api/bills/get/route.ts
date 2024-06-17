import { verifyTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";

export const GET = async (req: Request) => {
    const { session, userId } = await getSession();
    if (!session.isLoggedIn) {
        return Response.json(
            {
                status: "error",
                message: "Unauthorized",
            },
            {
                status: 401,
            }
        );
    }
    const team = await verifyTeam(userId);
    if (!team) {
        return Response.json(
            {
                message: "Team not found",
            },
            {
                status: 404,
            }
        );
    }
    const client = await clientPromise;
    const db = await client.db("main");
    const bills = await db.collection("bills");
    const billsList = await bills.find(
        {
            teamId: new ObjectId(team),
        },
        {
            sort: {
                emittedAt: -1,
            },
            projection: {
                emittedAt: 1,
                _id: 1,
                "recipient.name": 1,
                total: 1,
                status: 1,
                currency: 1
            },
        }
    );

    return Response.json(await billsList.toArray());
};
