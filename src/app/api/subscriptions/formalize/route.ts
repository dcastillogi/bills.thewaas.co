import { encrypt } from "@/lib/cipher";
import ePayCo from "@/lib/epayco";
import clientPromise from "@/lib/mongodb";
import moment from "moment-timezone";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export const POST = async (req: NextRequest) => {
    const {
        name,
        lastName,
        email,
        phone,
        phoneCode,
        city,
        address,
        cardNumber,
        expMonth,
        expYear,
        cvc,
        token,
        subscription,
        docNumber,
        docType,
    } = await req.json();

    const hCaptchaResponse = await fetch(
        `https://api.hcaptcha.com/siteverify?response=${token}&secret=${process.env.HCAPTCHA_SECRET_KEY}`,
        {
            method: "POST",
        }
    );

    const { success } = await hCaptchaResponse.json();

    if (!success) {
        return Response.json(
            {
                status: "error",
                message: "Por favor, verifica que no eres un robot",
            },
            { status: 400 }
        );
    }

    const client = await clientPromise;
    const db = client.db("main");
    const subscriptions = db.collection("subscriptions");

    const sub = await subscriptions.findOne({
        _id: new ObjectId(subscription),
    });

    if (!sub) {
        return Response.json(
            {
                status: "error",
                message: "Subscription not found",
            },
            { status: 404 }
        );
    }

    if (sub.status !== "created") {
        return Response.json(
            {
                status: "error",
                message: "La suscripción ya ha sido formalizada",
            },
            { status: 400 }
        );
    }

    const teams = db.collection("teams");
    const t = await teams.findOne({ _id: sub.teamId });
    const epayco = new ePayCo(t!.payments);

    const tokenData = await epayco.createToken({
        cardNumber,
        expMonth,
        expYear,
        cvc,
    });

    if (!tokenData) {
        return Response.json(
            {
                status: "error",
                message: "No pudimos procesar tu tarjeta",
            },
            { status: 400 }
        );
    }

    const customerData = await epayco.createCustomer({
        token_card: tokenData.id,
        name,
        last_name: lastName,
        email,
        city,
        address,
        phone: phoneCode + phone,
        doc_type: docType,
        doc_number: docNumber,
    });

    if (!customerData || !customerData.status) {
        return Response.json(
            {
                status: "error",
                message: "No pudimos procesar tu información de contacto",
            },
            { status: 400 }
        );
    }

    const contacts = db.collection("contacts");
    const cont = await contacts.findOne({ _id: sub.contactId });
    if (cont!.paymentContacts) {
        await contacts.updateOne(
            { _id: sub.contactId },
            {
                $push: {
                    paymentContacts: {
                        customerId: customerData.data.customerId,
                        name: name,
                        lastName: lastName,
                        email: email,
                        city: city,
                        address: address,
                        phone: phoneCode + phone,
                        docType: docType,
                        docNumber: docNumber,
                    } as any,
                },
            }
        );
    } else {
        await contacts.updateOne(
            { _id: sub.contactId },
            {
                $set: {
                    paymentContacts: [
                        {
                            customerId: customerData.data.customerId,
                            name: name,
                            lastName: lastName,
                            email: email,
                            city: city,
                            address: address,
                            phone: phoneCode + phone,
                            docType: docType,
                            docNumber: docNumber,
                        },
                    ],
                },
            }
        );
    }
    if (
        moment(sub.startDate).isSame(
            moment(new Date()).tz("America/Bogota"),
            "day"
        )
    ) {
        let subId;
        if (!sub.payment || !sub.payment.subscriptionId) {
            const subscriptionData = await epayco.createSubscription({
                id_plan: sub.planId.toString(),
                customer: customerData.data.customerId,
                token_card: tokenData.id,
                doc_type: docType,
                doc_number: docNumber,
                ip:
                    process.env.NODE_ENV === "development"
                        ? "152.201.50.47"
                        : req.ip!,
                url_confirmation:
                    "https://bills.thewaas.co/api/subscriptions/confirm",
            });
            if (!subscriptionData || !subscriptionData.status) {
                return Response.json(
                    {
                        status: "error",
                        message: "No pudimos crear tu suscripción",
                    },
                    { status: 400 }
                );
            }
            subId = subscriptionData.id;
        } else subId = sub.payment.subscriptionId;
        // Crear suscripción epayco

        // Actualizar suscripción
        await subscriptions.updateOne(
            { _id: sub._id },
            {
                $set: {
                    payment: {
                        type: "epayco",
                        subscriptionId: subId,
                        customerId: customerData.data.customerId,
                        cardToken: encrypt(tokenData.id),
                        ip:
                            process.env.NODE_ENV === "development"
                                ? "152.201.50.47"
                                : req.ip!,
                        docType,
                        docNumber,
                    },
                },
                $push: {
                    logs: {
                        date: new Date(),
                        message: `Suscripción aceptada por el cliente con tarjeta de ${name} ${lastName}`,
                    } as any,
                },
            }
        );

        // Cobrar primera cuota
        const chargeData = await epayco.chargeSubscription({
            id_plan: sub.planId.toString(),
            customer: customerData.data.customerId,
            token_card: tokenData.id,
            doc_type: docType,
            doc_number: docNumber,
            subscription: subId,
            ip:
                process.env.NODE_ENV === "development"
                    ? "152.201.50.47"
                    : req.ip!,
            url_confirmation:
                "https://bills.thewaas.co/api/subscriptions/confirm",
        });

        if (!chargeData || !chargeData.success) {
            return Response.json(
                {
                    status: "error",
                    message:
                        "No pudimos realizar el cobro, verifica tus datos de pago e intenta de nuevo",
                },
                { status: 400 }
            );
        }

        // Actualizar suscripción
        await subscriptions.updateOne(
            { _id: sub._id },
            {
                $push: {
                    logs: {
                        date: new Date(),
                        message: `Transacción ${chargeData.data.ref_payco} por $${chargeData.data.valor} realizada con éxito`,
                    } as any,
                },
                status: "active",
                nextPayment: moment(new Date()).add(1, "month").toDate(),
            }
        );
    } else if (
        moment(sub.startDate).isAfter(
            moment(new Date()).tz("America/Bogota"),
            "day"
        )
    ) {
        // Crear suscripción programada
        await subscriptions.updateOne(
            { _id: sub._id },
            {
                $set: {
                    status: "pending",
                    payment: {
                        type: "epayco",
                        customerId: customerData.data.customerId,
                        cardToken: encrypt(tokenData.id),
                        ip:
                            process.env.NODE_ENV === "development"
                                ? "152.201.50.47"
                                : req.ip!,
                        docType,
                        docNumber,
                    },
                },
                $push: {
                    logs: {
                        date: new Date(),
                        message: `Suscripción aceptada por el cliente con tarjeta ${name} ${lastName} y programada para el ${moment(
                            sub.startDate
                        )
                            .tz("America/Bogota")
                            .format("DD/MM/YYYY")}`,
                    } as any,
                },
            }
        );
    } else {
        return Response.json(
            {
                status: "error",
                message: "La fecha de inicio de la suscripción ya ha pasado",
            },
            { status: 400 }
        );
    }

    return Response.json({
        status: "success",
    });
};
