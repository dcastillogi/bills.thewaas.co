import { getTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";

export const GET = async (req: Request) => {
    const { session, userId } = await getSession();
    const { searchParams } = new URL(req.url);

    if (!searchParams.has("team")) {
        return Response.json(
            {
                message: "Some fields are missing in the request",
            },
            {
                status: 400,
            }
        );
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

    const team = await getTeam(userId, searchParams.get("team")!);

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
    const contacts = await db.collection("contacts");
    const contactsList = await contacts.find(
        {
            teamId: team._id,
        },
        {
            sort: {
                name: 1,
            },
            projection: {
                name: 1,
                blobUrl: 1,
                _id: 1,
                currency: 1,
                lang: 1,
            },
        }
    );

    return Response.json(await contactsList.toArray());
};
