const { Vonage } = require('@vonage/server-sdk')

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY!,
  apiSecret: process.env.VONAGE_API_SECRET!
})

export async function sendSMS(from: string, to: string, text: string) {
    try {
        await vonage.sms.send({to, from, text, type: "unicode"})
        return true
    } catch (error) {
        return false
    }
}