import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

import { BillEmail } from "../../emails/Bill";

export const sendBill = async (
    to: { name: string; email: string },
    issuer: { name: string; email: string },
    billId: string
) => {
    try {
        const res = await resend.emails.send({
            from: "no-responder@bills.thewaas.co",
            to: [`${to.name} <${to.email}>`, `${issuer.name} <${issuer.email}>`],
            subject: `Tu Cuenta de Cobro No. ${billId} ha sido generada`,
            text: "it works!",
            attachments: [
                {
                    filename: `${billId}.pdf`,
                    path: `https://bills.thewaas.co/api/bill/${billId}`,
                },
            ],
            react: <BillEmail />
        });
        if (!res.data) {
            return false;
        }
        return res.data?.id;
    } catch (error) {
        return false;
    }
};
