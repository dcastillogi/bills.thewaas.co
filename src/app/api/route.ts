import { encrypt } from "@/lib/cipher";
import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
    // get request parameters
    const searchParams = request.nextUrl.searchParams;
    const password = searchParams.get("password");

    const client = await clientPromise;
    const db = await client.db("main");
    const users = await db.collection("users");

    const bcrypt = require("bcrypt");
    const saltRounds = 10;

    const otplib = require("otplib");

    const secret = otplib.authenticator.generateSecret();

    const user = await users.insertOne({
        email: "dani.quice.c@gmail.com",
        password: await bcrypt.hash(password, saltRounds),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        totpSecret: encrypt(secret),
        defaultTeam: "",
    });

    const teams = await db.collection("teams");
    await teams.insertOne({
        name: "Conexiones Digitales",
        user: user.insertedId,
        info: {
            name: "Daniela Quiceno Cruz",
            docType: "CC",
            docNumber: "1032457981",
            email: "dani.quice.c@gmail.com",
            phone: "573108116052",
            city: { country: "CO", state: "66", city: "66001" },
            address: "CALLE 141 #15A-32",
            zip: "600001",
        },
        photoUrl:
            "https://jotnegymsjbalelr.public.blob.vercel-storage.com/teams/666b7972d890e93713c66e13-IJD0bX0Wv9ak0M0CHLh6b8uK4IQZO8.jpg",
        color: "#EBB413",
    });

    return Response.json({
        message: "Your account has been created successfully!",
        secret,
    });
};
