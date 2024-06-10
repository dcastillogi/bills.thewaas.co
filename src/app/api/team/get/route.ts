import { getSession } from "@/lib/session";
import { getTeam } from "@/lib/actions";

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

    const team = await getTeam(userId, searchParams.get("id")!)

    return Response.json({
        data: team
    });
};