import { decrypt, encrypt } from "@/lib/cipher";
import clientPromise from "@/lib/mongodb";
import { NextRequest } from "next/server";

/*
export const GET = async (request: NextRequest) => {
    const client = await clientPromise;
    const db = await client.db("main");
    const users = await db.collection("users");

    const bcrypt = require("bcrypt");
    const saltRounds = 10;
    const plainTextPassword = "password123";

    const otplib = require('otplib');

    users.insertOne({
        email: "dcastillogi@proton.me",
        password: await bcrypt.hash(plainTextPassword, saltRounds),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        totpSecret: encrypt(otplib.authenticator.generateSecret()),
    });
    return Response.json({
        message: "Hello, world!",
    });
};
*/

export const GET = async (request: NextRequest) => {
    const client = await clientPromise;
    const db = await client.db("main");
    const users = await db.collection("users");

    
    const user = await users.findOne({ email: "dcastillogi@proton.me" });
    return Response.json({
        message: decrypt(user!.totpSecret),
    });
};