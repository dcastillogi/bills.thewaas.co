import clientPromise from "@/lib/mongodb";
import { sendSMS } from "@/lib/vonage";
import { ObjectId } from "mongodb";

export const GET = async (req: Request) => {
    const { searchParams } = new URL(req.url);
    if (!searchParams.has("token") || !searchParams.get("bill"))
        return Response.json(
            {
                message: "Some fields are missing in the request",
            },
            {
                status: 400,
            }
        );

    const response = await fetch(
        `https://hcaptcha.com/siteverify?response=${searchParams.get(
            "token"
        )!}&secret=${process.env.HCAPTCHA_SECRET_KEY!}`
    );

    if (!response.ok) {
        return Response.json(
            {
                message: "Error in hCaptcha verification",
            },
            {
                status: 500,
            }
        );
    }

    const data = await response.json();
    if (!data.success) {
        return Response.json(
            {
                message: "hCaptcha verification failed",
            },
            {
                status: 400,
            }
        );
    }

    const client = await clientPromise;
    const db = client.db("main");
    const collection = db.collection("bills");

    if (!ObjectId.isValid(searchParams.get("bill")!)) {
        return Response.json(
            {
                message: "Invalid bill ID",
            },
            {
                status: 400,
            }
        );
    }

    const bill = await collection.findOne({
        _id: new ObjectId(searchParams.get("bill")!),
    });
    if (!bill) {
        return Response.json(
            {
                message: "Bill not found",
            },
            {
                status: 404,
            }
        );
    }

    const code = Math.floor(Math.random() * 99999999)
        .toString()
        .padStart(8, "0");
    const sms = await sendSMS(
        bill.recipient.phone,
        bill._id.toString(),
        code,
        bill.lang
    );
    if (!sms) {
        return Response.json(
            {
                message: "Error sending the SMS",
            },
            {
                status: 500,
            }
        );
    }
    await collection.updateOne(
        { _id: bill._id },
        {
            $push: {
                signCodes: {
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 1000 * 60 * 15),
                    code,
                    sms: sms.messages.pop().messageId,
                    _id: new ObjectId(),
                } as any,
            },
        }
    );
    return Response.json(
        {
            message: "SMS sent",
        },
        {
            status: 200,
        }
    );
};
