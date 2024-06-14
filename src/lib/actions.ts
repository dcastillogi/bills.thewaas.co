"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "./session";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { headers } from "next/headers";

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

export const getContacts = async (teamId: string) => {
    const client = await clientPromise;
    const db = await client.db("main");
    const contacts = await db.collection("contacts");

    const contactsList = await contacts.find(
        {
            teamId: new ObjectId(teamId),
        },
        {
            sort: {
                name: 1,
            },
            projection: {
                name: 1,
                docType: 1,
                email: 1,
                phone: 1,
                city: 1,
                photoblobUrl: 1,
                _id: 1,
            },
        }
    );

    return await contactsList.toArray();
};

export const verifyTeam = async (userId: ObjectId) => {
    const headersList = headers();
    const team = headersList.get("team");
    if (!team) {
        return false;
    }
    const client = await clientPromise;
    const db = await client.db("main");
    const teams = await db.collection("teams");

    const t = await teams.findOne({
        userId: userId,
        _id: new ObjectId(team),
    });

    return t ? t._id.toString() : false;
};

export const getCityInfo = async (
    country: string,
    state: string,
    city: string
) => {
    const client = await clientPromise;
    const db = await client.db("main");
    const geography = await db.collection("geography");
    const cityInfo = await geography.aggregate([
        {
            $match: {
                code: country,
            },
        },
        {
            $project: {
                states: 1,
                name: 1,
                _id: 0,
            },
        },
        {
            $unwind: "$states",
        },
        {
            $match: {
                "states.code": state,
            },
        },
        {
            $project: {
                cities: "$states.cities",
                "states.name": 1,
                name: 1,
            },
        },
        {
            $unwind: "$cities",
        },
        {
            $match: {
                "cities.code": city,
            },
        },
        {
            $project: {
                "cities.name": 1,
                "states.name": 1,
                name: 1,
            },
        },
    ]);
    const c = (await cityInfo.toArray())
    if (c.length != 1) {
        return false
    }
    return {
        country: c[0].name,
        state: c[0].states.name,
        city: c[0].cities.name
    };
};
