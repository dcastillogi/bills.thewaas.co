import { getSession } from "@/lib/session";

export const GET = async () => {
    const { session } = await getSession(false);
    await session.destroy();
    return Response.redirect(process.env.HOST!);
};
