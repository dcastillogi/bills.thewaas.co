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
    base_token: null | string = null;
    constructor(paymentOptions: paymentOptions) {
        this.apiKey = paymentOptions.public_key;
        this.privateKey = decrypt(paymentOptions.private_key);
    }

    verifyDocument(docType: string) {
        if (!["CC", "CE", "TI", "PPN", "NIT", "SSN", "DNI"].includes(docType)) {
            return "DNI";
        }
        return docType;
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

    async createToken(card: {
        cardNumber: string;
        expMonth: string;
        expYear: string;
        cvc: string;
    }) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(`${BASE_URL}/v1/tokens`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.base_token}`,
            },
            body: JSON.stringify({
                "card[number]": card.cardNumber,
                "card[exp_month]": card.expMonth,
                "card[exp_year]": card.expYear,
                "card[cvc]": card.cvc,
                hasCvv: true,
            }),
        });
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }

    async createCustomer(customer: {
        token_card: string;
        name: string;
        last_name: string;
        email: string;
        city: string;
        address: string;
        phone: string;
        doc_type: string;
        doc_number: string;
    }) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(`${BASE_URL}/payment/v1/customer/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.base_token}`,
            },
            body: JSON.stringify({
                ...customer,
                doc_type: this.verifyDocument(customer.doc_type),
                doc_number: customer.doc_number.replace(/[^a-zA-Z0-9]/g, ""),
                city: customer.city.replace(/[^a-zA-Z0-9]/g, ""),
            }),
        });
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }

    async createSubscription(subscription: {
        id_plan: string;
        customer: string;
        token_card: string;
        doc_type: string;
        doc_number: string;
        ip: string;
        url_confirmation: string;
    }) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(
            `${BASE_URL}/recurring/v1/subscription/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.base_token}`,
                },
                body: JSON.stringify({
                    ...subscription,
                    doc_type: this.verifyDocument(subscription.doc_type),
                    doc_number: subscription.doc_number.replace(
                        /[^a-zA-Z0-9]/g,
                        ""
                    ),
                }),
            }
        );
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }

    async chargeSubscription(charge: {
        id_plan: string;
        customer: string;
        token_card: string;
        doc_type: string;
        doc_number: string;
        ip: string;
        subscription: string;
        url_confirmation: string;
    }) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(
            `${BASE_URL}/payment/v1/charge/subscription/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.base_token}`,
                },
                cache: "no-cache",
                body: JSON.stringify({
                    ...charge,
                    doc_type: this.verifyDocument(charge.doc_type),
                    doc_number: charge.doc_number.replace(/[^a-zA-Z0-9]/g, ""),
                }),
            }
        );
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }

    async updateCustomer(
        customerId: string,
        customer: {
            name?: string;
            last_name?: string;
            email?: string;
            city?: string;
            address?: string;
            phone?: string;
            doc_type?: string;
            doc_number?: string;
        }
    ) {
        if (!this.base_token) {
            await this.getBaseToken();
        }
        const response = await fetch(
            `${BASE_URL}/payment/v1/customer/edit/${this.apiKey}/${customerId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${this.base_token}`,
                },
                body: JSON.stringify({
                    ...customer,
                    doc_type: customer.doc_type
                        ? this.verifyDocument(customer.doc_type)
                        : undefined,
                    doc_number: customer.doc_number
                        ? customer.doc_number.replace(/[^a-zA-Z0-9]/g, "")
                        : undefined,
                }),
            }
        );
        if (!response.ok) {
            return false;
        }
        return await response.json();
    }
}
