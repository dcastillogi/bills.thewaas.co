export const SALT_ROUNDS = 10;

export const LANGUAGES = [
    {
        name: "Español",
        id: "ES",
    },
    {
        name: "Inglés",
        id: "EN",
    },
];

export const CURRENCIES = [
    {
        name: "Peso colombiano",
        id: "COP",
    },
    {
        name: "Dólar estadounidense",
        id: "USD",
    },
];

export const DOCUMENT_TYPES = [
    {
        name: "Cédula de ciudadanía",
        id: "CC",
        country: "CO",
    },
    {
        name: "Cédula de extranjería",
        id: "CE",
        country: "CO",
    },
    {
        name: "Pasaporte",
        id: "PA",
        country: "CO",
    },
    {
        name: "NIT",
        id: "NIT",
        country: "CO",
    },
    {
        name: "EIN",
        id: "EIN",
        country: "US",
    },
    {
        name: "SSN",
        id: "SSN",
        country: "US",
    },
];

export const SUBSCRIPTION_INTERVALS = [
    {
        name: "Mensual",
        id: "month"
    }
]

export const SIGN_SMS: Record<string, string> = {
    "ES": "Su código para aceptar la CUENTA DE COBRO No. ****{id} es: {code}",
    "EN": "Your code to accept the BILLING STATEMENT No. ****{id} is: {code}",
}