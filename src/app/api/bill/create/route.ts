import { getCityInfo, verifyTeam } from "@/lib/actions";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";

export const POST = async (req: Request) => {
    const {
        contact,
        lang,
        currency,
        product,
        includePaymentLink,
        email,
        createdAt,
        expiresAt,
        payments,
        annotations,
    } = await req.json();
    const { session, userId } = await getSession();
    const team = await verifyTeam(userId);

    if (!team) {
        return Response.json(
            {
                status: "error",
                message: "Team not found",
            },
            { status: 404 }
        );
    }

    const client = await clientPromise;
    const db = client.db("main");
    const collection = db.collection("bills");

    let paymentLink = undefined;
    if (includePaymentLink) {
        paymentLink = "https://example.com";
    }

    const contactInfo = await db
        .collection("contacts")
        .findOne({ _id: new ObjectId(contact) });
    if (!contactInfo) {
        return Response.json(
            {
                status: "error",
                message: "Contact not found",
            },
            { status: 404 }
        );
    }

    const teamInfo = (await db.collection("teams").findOne({ _id: new ObjectId(team) }))!;

    const issuerCity = await getCityInfo(contactInfo.city.country, contactInfo.city.state, contactInfo.city.city);
    const recipientCity = await getCityInfo(teamInfo.city.country, teamInfo.city.state, teamInfo.city.city);

    const newBill = await collection.insertOne({
        issuer: {
            name: teamInfo.name,
            document: teamInfo.docType + teamInfo.docNumber,
            email: teamInfo.email,
            phone: teamInfo.phone,
            address: teamInfo.address,
            city: issuerCity.city + ", " + issuerCity.state,
            country: issuerCity.country,
        },
        recipient: {
            contact: contact,
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
            city: recipientCity.city + ", " + recipientCity.state,
            country: recipientCity.country,
        },
        teamId: team,
        lang,
        currency,
        products: product,
        paymentLink,
        email,
        createdAt,
        expiresAt,
        payments,
        annotations,
        logs: []
    });

    return Response.json({
        status: "success",
        message: "Bill created",
        bill: newBill.insertedId,
    });
};
