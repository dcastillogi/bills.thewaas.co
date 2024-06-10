import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";

export const GET = async () => {
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

    const client = await clientPromise;
    const db = await client.db("main");
    const teams = await db.collection("teams");

    const teamsList = await teams.find(
        {
            userId: new ObjectId(userId),
        },
        {
            sort: {
                name: 1,
            },
            projection: {
                _id: 1,
                name: 1
            }
        }
    );

    return Response.json({
        data: await teamsList.toArray()
    });
};
