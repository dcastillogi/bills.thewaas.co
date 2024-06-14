import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const POST = async (req: Request) => {
    const { pin, billId } = await req.json();

    const client = await clientPromise;
    const db = client.db("main");
    const collection = db.collection("bills");

    const bill = await collection
        .aggregate([
            { $match: { _id: new ObjectId(billId) } },
            {
                $unwind: "$signCodes",
            },
            {
                $match: { "signCodes.code": pin },
            },
        ])
        .toArray();
    if (bill.length === 0) {
        return Response.json(
            {
                status: "error",
                message: "Invalid OTP",
            },
            { status: 400 }
        );
    }

    if (bill[0].status != "sent") {
        return Response.json(
            {
                status: "error",
                message: "Invalid status",
            },
            { status: 400 }
        );
    }

    if (bill[0].signCodes.expiresAt < new Date()) {
        return Response.json(
            {
                status: "error",
                message: "OTP expired",
            },
            { status: 400 }
        );
    }

    await collection.updateOne(
        { _id: new ObjectId(billId) },
        {
            $push: {
                logs: {
                    date: new Date(),
                    action: "sign",
                    id: bill[0].signCodes._id,
                } as any,
            },
            $set: {
                status: "signed",
            },
        }
    );

    return Response.json({ status: "success" });
};
