import { decrypt } from "@/lib/cipher";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";
import { authenticator } from "otplib";

export const POST = async (request: NextRequest) => {
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

    const { pin } = await request.json();
    const client = await clientPromise;
    const db = await client.db("main");
    const users = await db.collection("users");
    const user = await users.findOne({ _id: new ObjectId(userId) });
    const secret = decrypt(user!.totpSecret);
    const isValid = authenticator.check(pin, secret);
    session.isVerified = isValid;
    session.team = user!.defaultTeam;
    await session.save();
    return Response.json({
        status: isValid ? "success" : "error",
        message: isValid ? "MFA is verified" : "Invalid MFA code",
        team: isValid ? user!.defaultTeam : undefined
    });
};
