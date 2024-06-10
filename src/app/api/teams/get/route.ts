
import { getSession } from "@/lib/session";
import { getTeams } from "@/lib/utils";

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

    const teamsList = await getTeams(userId)

    return Response.json({
        data: teamsList
    });
};

