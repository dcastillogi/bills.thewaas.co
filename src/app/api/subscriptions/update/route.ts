import { decrypt } from "@/lib/cipher";
import ePayCo from "@/lib/epayco";
import clientPromise from "@/lib/mongodb";
import moment from "moment-timezone";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response("Unauthorized", {
            status: 401,
        });
    }

    const client = await clientPromise;
    const db = await client.db("main");
    const subscriptions = await db.collection("subscriptions");
    const teams = await db.collection("teams");

    let subCount = 0;

    // =================== Activate and charge pending subscriptions ===================

    try {
        const pendingSubs = await subscriptions
            .find({
                status: "pending",
                startDate: {
                    $lte: moment().tz("America/Bogota").startOf("day").toDate(),
                    $gte: moment().tz("America/Bogota").endOf("day").toDate(),
                },
            })
            .toArray();

        for (const sub of pendingSubs) {
            subCount++;
            const team = await teams.findOne({ _id: sub.teamId });
            const epayco = new ePayCo(team!.payments!);
            const subscriptionData = await epayco.createSubscription({
                id_plan: sub.planId,
                customer: sub.payment.customerId,
                token_card: decrypt(sub.payment.cardToken),
                doc_type: sub.payment.docType,
                doc_number: sub.payment.docNumber,
                ip: sub.payment.ip,
                url_confirmation:
                    "https://bills.thewaas.co/api/subscriptions/confirm",
            });
            if (!subscriptionData || !subscriptionData.status) {
                await subscriptions.updateOne(
                    { _id: sub._id },
                    {
                        $set: {
                            status: "failed",
                        },
                        $push: {
                            logs: {
                                date: new Date(),
                                message: `No pudimos crear la suscripción automáticamente`,
                            } as any,
                        },
                    }
                );
                continue;
            }
            await subscriptions.updateOne(
                { _id: sub._id },
                {
                    $set: {
                        payment: {
                            type: "epayco",
                            subscriptionId: subscriptionData.id,
                            customerId: sub.payment.customerId,
                            cardToken: sub.payment.cardToken,
                            ip: sub.payment.ip,
                            docType: sub.payment.docType,
                            docNumber: sub.payment.docNumber,
                        },
                    },
                    $push: {
                        logs: {
                            date: new Date(),
                            message: `Suscripción activada automáticamente`,
                        } as any,
                    },
                }
            );
            const chargeData = await epayco.chargeSubscription({
                id_plan: sub.planId.toString(),
                customer: sub.payment.customerId,
                token_card: decrypt(sub.payment.cardToken),
                doc_type: sub.payment.docType,
                doc_number: sub.payment.docNumber,
                subscription: subscriptionData.id,
                ip: sub.payment.ip,
                url_confirmation:
                    "https://bills.thewaas.co/api/subscriptions/confirm",
            });

            if (!chargeData || !chargeData.success) {
                await subscriptions.updateOne(
                    { _id: sub._id },
                    {
                        $set: {
                            status: "failed",
                        },
                        $push: {
                            logs: {
                                date: new Date(),
                                message: `No pudimos cobrar la primera cuota automáticamente`,
                            } as any,
                        },
                    }
                );
                continue;
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
        }
    } catch (error) {
        console.error(error);
    }

    // =================== Charge active suscriptions ===================
    try {
        const activeSubs = await subscriptions
            .find({
                status: "active",
                nextPayment: {
                    $lte: moment().tz("America/Bogota").startOf("day").toDate(),
                    $gte: moment().tz("America/Bogota").endOf("day").toDate(),
                },
            })
            .toArray();

        for (const sub of activeSubs) {
            subCount++;
            const team = await teams.findOne({ _id: sub.teamId });
            const epayco = new ePayCo(team!.payments!);
            const chargeData = await epayco.chargeSubscription({
                id_plan: sub.planId.toString(),
                customer: sub.payment.customerId,
                token_card: decrypt(sub.payment.cardToken),
                doc_type: sub.payment.docType,
                doc_number: sub.payment.docNumber,
                subscription: sub.payment.subscriptionId,
                ip: sub.payment.ip,
                url_confirmation:
                    "https://bills.thewaas.co/api/subscriptions/confirm",
            });

            if (!chargeData || !chargeData.success) {
                await subscriptions.updateOne(
                    { _id: sub._id },
                    {
                        $set: {
                            status: "failed",
                        },
                        $push: {
                            logs: {
                                date: new Date(),
                                message: `No pudimos cobrar la cuota automáticamente`,
                            } as any,
                        },
                    }
                );
                continue;
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
                    nextPayment: moment(new Date()).add(1, "month").toDate(),
                }
            );
        }
    } catch (error) {}

    return NextResponse.json({ ok: true, subCount });
};
