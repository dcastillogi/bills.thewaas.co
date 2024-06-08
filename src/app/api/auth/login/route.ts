import clientPromise from "@/lib/mongodb";
import { type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { SessionData, sessionOptions } from "@/lib/iron-session";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
    const { email, password, remember_me, token } = await request.json();

    // Verify hCaptcha token
    const response = await fetch("https://hcaptcha.com/siteverify", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `response=${token}&secret=${process.env.HCAPTCHA_SECRET_KEY!}`,
    });

    const data = await response.json();

    if (!data.success) {
        return Response.json(
            {
                status: "error",
                message: "Invalid hCaptcha token",
            },
            {
                status: 401,
            }
        );
    }

    const client = await clientPromise;
    const db = await client.db("main");
    const users = await db.collection("users");

    const bcrypt = require("bcrypt");
    const user = await users.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return Response.json(
            {
                status: "error",
                message: "Invalid email or password",
            },
            {
                status: 401,
            }
        );
    }

    const expireDate = remember_me
        ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        : new Date(Date.now() + 1000 * 60 * 60 * 24);

    const sessions = await db.collection("sessions");
    const dbSession = await sessions.insertOne({
        userId: user._id,
        expiresAt: expireDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        isVerified: false,
        userAgent: request.headers.get("user-agent"),
        ip: request.ip,
    });

    const session = await getIronSession<SessionData>(cookies(), {
        ...sessionOptions,
        cookieOptions: {
            ...sessionOptions.cookieOptions,
            expires: expireDate,
        },
    });
    session.isLoggedIn = true;
    session.email = email;
    session.isVerified = false;
    session.session = dbSession.insertedId.toString();

    await session.save();

    return Response.json({
        status: "success",
    });
}
