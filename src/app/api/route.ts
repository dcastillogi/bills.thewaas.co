import ePayCo from "@/lib/epayco"

export const GET = async() => {
    const epayco = new ePayCo({
        private_key: {
            iv: "c1a57fc4262a952b2e53001a64605fb8",
            encryptedData: "7714f248b473ef85f70dad8676feeb1b42d1d64a374c331f29b043984dc63a92e4192448609e667a9c6f1cf7a3b46105"
        },
        public_key: "889430db37c01f442af10ae5c597420d"
    });

    const res = await epayco.updateCustomer("6849aa38bf3aba7050a9ef2", {
        city: "Miami"
    })

    return Response.json(res)

}