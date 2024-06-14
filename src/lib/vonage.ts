import { SIGN_SMS } from "./const"

const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!
})

export async function sendSMS(to: string, billId: string, code: string, lang: string) {
    const message = SIGN_SMS[lang].replace("{code}", code).replace("{id}", billId.slice(-4))
    try {
        return await vonage.sms.send({to, from: 'Bills by The Waas Co', text: message, type: "unicode"})
    } catch (error) {
        return false
    }
}