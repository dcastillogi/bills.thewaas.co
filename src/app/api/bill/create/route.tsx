import { getCityInfo, verifyTeam } from "@/lib/actions";
import { sendBill } from "@/lib/email";
import clientPromise from "@/lib/mongodb";
import { getSession } from "@/lib/session";
import { ObjectId } from "mongodb";
import moment from "moment-timezone";

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

    const teamInfo = (await db
        .collection("teams")
        .findOne({ _id: new ObjectId(team) }))!;
    const recipientCity = await getCityInfo(
        contactInfo.city.country,
        contactInfo.city.state,
        contactInfo.city.city
    );
    if (!recipientCity) {
        return Response.json(
            {
                status: "error",
                message: "There is an error with the issuer city",
            },
            { status: 400 }
        );
    }
    const issuerCity = await getCityInfo(
        teamInfo.info.city.country,
        teamInfo.info.city.state,
        teamInfo.info.city.city
    );
    if (!issuerCity) {
        return Response.json(
            {
                status: "error",
                message: "There is an error with the recipient city",
            },
            { status: 400 }
        );
    }

    let total = 0;
    const productsFormated = [];
    for (const p of product) {
        total += parseFloat(p.price) * parseInt(p.quantity);
        productsFormated.push({
            title: p.title,
            description: p.description,
            quantity: parseInt(p.quantity),
            price: parseFloat(p.price),
            total: parseFloat(p.price) * parseInt(p.quantity),
        });
    }

    let paymentsFormated = [];
    let paymentsTotal = 0;
    if (payments.length > 0) {
        for (const p of payments) {
            paymentsTotal += parseFloat(p.amount);
            paymentsFormated.push({
                amount: parseFloat(p.amount),
                date: moment(p.date).endOf('day').tz('America/Bogota').toDate(),
            });
        }
    }

    const emmitedAtAdjusted = moment(createdAt).startOf('day').tz('America/Bogota').toDate();
    const expiresAtAdjusted = moment(expiresAt).endOf('day').tz('America/Bogota').toDate();
    const newBill = await collection.insertOne({
        issuer: {
            name: teamInfo.info.name,
            document: teamInfo.info.docType + teamInfo.info.docNumber,
            email: teamInfo.info.email,
            phone: teamInfo.info.phone,
            address: teamInfo.info.address,
            city: issuerCity.city + ", " + issuerCity.state,
            country: issuerCity.country,
            zip: teamInfo.info.zip,
            photoUrl: teamInfo.photoUrl,
            color: teamInfo.color,
        },
        recipient: {
            contact: contact,
            document: contactInfo.docType + (contactInfo.docNumber ? contactInfo.docNumber : ""),
            name: contactInfo.name,
            email: contactInfo.email,
            phone: contactInfo.phone,
            address: contactInfo.address,
            city: recipientCity.city + ", " + recipientCity.state,
            country: recipientCity.country,
            zip: contactInfo.zip,
        },
        status: "generated",
        teamId: new ObjectId(team),
        lang,
        currency,
        products: productsFormated,
        paymentLink,
        email,
        emittedAt: emmitedAtAdjusted,
        createdAt: new Date(),
        expiresAt: expiresAtAdjusted,
        payments: paymentsFormated,
        annotations,
        subtotal: total,
        total: total,
        logs: [],
        signCodes: [],
    });

    const mail = await sendBill(
        { name: contactInfo.name, email },
        { name: teamInfo.info.name, email: teamInfo.info.email },
        newBill.insertedId.toString(),
        {
            _id: newBill.insertedId.toString(),
            emittedAt: emmitedAtAdjusted.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "America/Bogota",
            }),
            currency: currency,
            expiresAt: expiresAtAdjusted.toLocaleDateString("es-CO", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "America/Bogota",
            }),
            issuer: {
                name: teamInfo.info.name,
                document: teamInfo.info.docType + teamInfo.info.docNumber,
                email: teamInfo.info.email,
                phone: teamInfo.info.phone,
                address: teamInfo.info.address,
                city: issuerCity.city + ", " + issuerCity.state,
                country: issuerCity.country,
                zip: teamInfo.info.zip,
            },
            recipient: {
                contact: contact,
                document: contactInfo.docType + (contactInfo.docNumber ? contactInfo.docNumber : ""),
                name: contactInfo.name,
                email: contactInfo.email,
                phone: contactInfo.phone,
                address: contactInfo.address,
                city: recipientCity.city + ", " + recipientCity.state,
                country: recipientCity.country,
                zip: contactInfo.zip,
            },
            products: productsFormated,
            subtotal: total,
            total: total,
            payments: paymentsFormated,
        }
    );

    if (mail)
        await collection.updateOne(
            { _id: newBill.insertedId },
            {
                $push: {
                    logs: {
                        date: new Date(),
                        action: "email_sent",
                        id: mail,
                    } as any,
                },
                $set: {
                    status: "sent",
                },
            }
        );

    return Response.json({
        status: "success",
        message: "Bill created",
        bill: newBill.insertedId,
        email: mail,
    });
};
