import { decrypt } from "./cipher";

const APIFY_URL = "https://apify.epayco.co";
const BASE_URL = "https://api.secure.payco.co";

type paymentOptions = {
    private_key: {
        iv: string;
        encryptedData: string;
    };
    public_key: string;
};

export default class ePayCo {
    privateKey: string;
    apiKey: string;
    apify_token: null | string = null;
    base_token: null | string = null
    constructor(paymentOptions: paymentOptions) {
        this.apiKey = paymentOptions.public_key;
        this.privateKey = decrypt(paymentOptions.private_key);
    }

    async getApifyToken() {
        const encoded = Buffer.from(
            `${this.apiKey}:${this.privateKey}`
        ).toString("base64");
        const response = await fetch(`${APIFY_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${encoded}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to get token");
        }
        const data = await response.json();
        this.apify_token = data.token;
    }

    async getBaseToken() {
        const response = await fetch(`${BASE_URL}/v1/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                public_key: this.apiKey,
                private_key: this.privateKey,
            }),
        });
        if (!response.ok) {
            throw new Error("Failed to get token");
        }
        const data = await response.json();
        this.base_token = data.bearer_token;
    }

    async createPlan(plan: {
        name: string;
        description: string;
        amount: number;
        currency: string;
        interval: string;
        interval_count: number;
        trial_days: number;
        id_plan: string;
    }) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(`${BASE_URL}/recurring/v1/plan/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.base_token}`,
            },
            body: JSON.stringify(plan),
        });
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }
}
