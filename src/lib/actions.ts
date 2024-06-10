"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "./session";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

export async function logout() {
    // false => no db call for logout
    const { session } = await getSession(false);
    session.destroy();
    revalidatePath("/");
}

export const getTeam = async (userId: string, teamId: string) => {
    const client = await clientPromise;
    const db = await client.db("main");
    const teams = await db.collection("teams");

    return await teams.findOne({
        userId: new ObjectId(userId),
        _id: new ObjectId(teamId),
    });
};

export const getTeams = async (userId: string) => {
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
                name: 1,
            },
        }
    );
    return await teamsList.toArray();
};
