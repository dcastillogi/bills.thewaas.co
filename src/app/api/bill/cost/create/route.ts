import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { put } from "@vercel/blob";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
    const formData = await req.formData();
    const { concept, id, amount } = JSON.parse(formData.get("data")! as string);

    const headersList = headers();
    const bill = headersList.get("bill");
    if (!bill) {
        return Response.json(
            {
                status: "error",
                message: "Some fields are missing",
            },
            {
                status: 400,
            }
        );
    }

    const { session, userId } = await getSession();

    if (!session) {
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
    const bills = await db.collection("bills");

    const b = await bills.findOne({
        _id: new ObjectId(bill),
    });

    if (!b) {
        return Response.json(
            {
                status: "error",
                message: "Bill not found",
            },
            {
                status: 404,
            }
        );
    }

    const teams = await db.collection("teams");

    const userTeam = await teams.findOne({
        userId: userId,
        _id: b.teamId,
    });

    if (!userTeam) {
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

    let blobUrl = undefined;

    if (formData.has("invoice") && formData.get("invoice")) {
        const invoiceFile = formData.get("invoice")! as File;
        blobUrl = (
            await put(
                `bill/${bill}/${id}.${invoiceFile.name.split(".").slice(-1)}`,
                invoiceFile
            )
        ).url;
    }

    if (b.costs)
        b.costs.push({
            id,
            concept,
            amount,
            invoice: blobUrl,
        });
    else
        b.costs = [
            {
                id,
                concept,
                amount,
                invoice: blobUrl,
            },
        ];

    return Response.json({
        status: "success",
    });
};
