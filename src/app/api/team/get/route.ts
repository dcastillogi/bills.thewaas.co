import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";

export const GET = async (request: Request) => {
    const { session, userId } = await getSession();
    const { searchParams } = new URL(request.url)

    if (!searchParams.has("id")) {
        return Response.json({
            message: "Some fields are missing in the request"
        }, {
            status: 400
        })
    }

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

    const team = await teams.findOne(
        {
            userId: new ObjectId(userId),
            _id: new ObjectId(searchParams.get("id")!)
        }
    );

    return Response.json({
        data: team
    });
};
