import { verifyTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { put } from "@vercel/blob";
import { ObjectId } from "mongodb";

export const POST = async (req: Request) => {
    const formData = await req.formData();
    const {
        name,
        docType,
        docNumber,
        email,
        phone,
        city,
        state,
        country,
        address,
        zip,
        lang,
        currency,
    } = JSON.parse(formData.get("data")! as string);

    const { session, userId } = await getSession();

    const team = await verifyTeam(userId);

    if (!team) {
        return Response.json(
            {
                status: "error",
                message: "Team not found",
            },
            {
                status: 404,
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

    const client = await clientPromise;
    const db = await client.db("main");
    const contacts = await db.collection("contacts");

    if (
        docType != "NA" && await contacts.findOne({
            teamId: team,
            docType,
            docNumber,
        })
    ) {
        return Response.json(
            {
                status: "error",
                message: "Contact already exists",
            },
            {
                status: 400,
            }
        );
    }

    const contact = await contacts.insertOne({
        teamId: new ObjectId(team),
        name,
        docType,
        docNumber: docNumber ? docNumber.replace(".", "") : undefined,
        email,
        phone,
        city: {
            city,
            state,
            country,
        },
        address,
        zip,
        createdAt: new Date(),
        lang,
        currency,
    });

    let blobUrl = undefined;

    if (formData.has("photo") && formData.get("photo")) {
        const photoFile = formData.get("photo")! as File;
        blobUrl = (
            await put(
                `contact/${contact.insertedId}.${photoFile.name
                    .split(".")
                    .slice(-1)}`,
                photoFile
            )
        ).url;

        await contacts.updateOne(
            {
                _id: contact.insertedId,
            },
            {
                blobUrl,
            }
        );
    }

    return Response.json({
        _id: contact.insertedId.toString(),
        name: name,
        blobUrl,
    });
};
