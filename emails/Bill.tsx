import { toMoneyFormat } from "@/lib/utils";
import {
    Body,
    Container,
    Column,
    Head,
    Heading,
    Hr,
    Html,
    Link,
    Preview,
    Row,
    Section,
    Text,
} from "@react-email/components";
import * as React from "react";

export const BillEmail = ({
    bill,
}: {
    bill: {
        _id: string;
        emittedAt: string;
        expiresAt: string;
        issuer: {
            name: string;
            document: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            country: string;
            zip: string;
        };
        recipient: {
            contact: string;
            document: string;
            name: string;
            email: string;
            phone: string;
            address: string;
            city: string;
            country: string;
            zip: string;
        };
        products: any[];
        currency: string;
        subtotal: number;
        total: number;
    };
}) => (
    <Html>
        <Head />
        <Preview>
            Estimado(a) {bill.recipient.name}, la cuenta de cobro No.
            {bill._id} ha sido generada con éxito por un valor de
            {toMoneyFormat(bill.total, bill.currency)}. Puede revisar el
            documento adjunto. Si tiene alguna pregunta, no dude en
            contactarnos.
        </Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={track.container}>
                    <Row>
                        <Column>
                            <Text style={global.paragraphWithBold}>
                                No. Cuenta de Cobro
                            </Text>
                            <Text style={track.number}>{bill._id}</Text>
                        </Column>
                        <Column align="right">
                            <Link
                                href={`${process.env.HOST}/bill/${bill._id}`}
                                style={global.button}
                            >
                                Aceptar
                            </Link>
                        </Column>
                    </Row>
                </Section>
                <Hr style={global.hr} />
                <Section style={message}>
                    <Heading style={global.heading}>
                        Notificación Cuenta de Cobro
                    </Heading>
                    <Text style={global.text}>
                        Estimado(a) {bill.recipient.name}, tu cuenta de cobro
                        ha sido generada con éxito. Puedes revisar el documento
                        adjunto. Si tienes alguna pregunta, no dudes en
                        contactarnos.
                    </Text>
                </Section>
                <Hr style={global.hr} />
                <Section style={global.defaultPadding}>
                    <Text style={adressTitle}>Emisor: {bill.issuer.name}</Text>
                    <Text style={{ ...global.text, fontSize: 14 }}>
                        {bill.issuer.document}
                    </Text>
                </Section>
                <Hr style={global.hr} />
                <Section
                    style={{
                        ...paddingX,
                        paddingTop: "40px",
                        paddingBottom: "40px",
                    }}
                >
                    {bill.products.map((product, index) => (
                        <Row key={`product-${index}`}>
                            <Column
                                style={{
                                    verticalAlign: "top",
                                }}
                            >
                                <Text
                                    style={{ ...paragraph, fontWeight: "500" }}
                                >
                                    {product.title}
                                </Text>
                                {product.description && product.description.length > 1 && (
                                    <Text style={global.text}>
                                        {product.description}
                                    </Text>
                                )}
                            </Column>
                            <Column align="right">
                                <Text style={global.text}>{toMoneyFormat(product.price, bill.currency)} x {product.quantity}</Text>
                            </Column>
                        </Row>
                    ))}
                </Section>
                <Hr style={global.hr} />
                <Section style={global.defaultPadding}>
                    <Row style={{ display: "inline-flex", marginBottom: 40 }}>
                        <Column style={{ width: "240px" }}>
                            <Text style={global.paragraphWithBold}>
                                No. Cuenta de Cobro
                            </Text>
                            <Text style={track.number}>{bill._id}</Text>
                        </Column>
                        <Column>
                            <Text style={global.paragraphWithBold}>Total</Text>
                            <Text style={track.number}>
                                {toMoneyFormat(bill.total, bill.currency)}
                            </Text>
                        </Column>
                    </Row>
                    <Row>
                        <Column align="center">
                            <Link
                                style={global.button}
                                href={`${process.env.HOST}/bill/${bill._id}`}
                            >
                                Aceptar
                            </Link>
                        </Column>
                    </Row>
                </Section>

                <Hr style={global.hr} />
                <Section style={menu.container}>
                    <Row>
                        <Text style={menu.title}>¿Crees que hay un error?</Text>
                    </Row>
                    <Row style={menu.tel}>
                        <Column>
                            <Text
                                style={{
                                    ...menu.text,
                                    marginBottom: "0",
                                }}
                            >
                                {bill.issuer.phone}
                            </Text>
                        </Column>
                        <Column>
                            <Text
                                style={{
                                    ...menu.text,
                                    marginBottom: "0",
                                }}
                            >
                                {bill.issuer.email}
                            </Text>
                        </Column>
                    </Row>
                </Section>
                <Hr style={global.hr} />
                <Section style={paddingY}>
                    <Row>
                        <Text style={footer.text}>
                            Powered by Bills - © The Waas Co.
                        </Text>
                    </Row>
                </Section>
            </Container>
        </Body>
    </Html>
);

export default BillEmail;

const paddingX = {
    paddingLeft: "40px",
    paddingRight: "40px",
};

const paddingY = {
    paddingTop: "22px",
    paddingBottom: "22px",
};

const paragraph = {
    margin: "0",
    lineHeight: "2",
};

const global = {
    paddingX,
    paddingY,
    defaultPadding: {
        ...paddingX,
        ...paddingY,
    },
    paragraphWithBold: { ...paragraph, fontWeight: "bold" },
    heading: {
        fontSize: "32px",
        lineHeight: "1.3",
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: "-1px",
    } as React.CSSProperties,
    text: {
        ...paragraph,
        color: "#747474",
        fontWeight: "500",
    },
    button: {
        border: "1px solid #929292",
        fontSize: "16px",
        textDecoration: "none",
        padding: "10px 0px",
        width: "220px",
        display: "block",
        textAlign: "center",
        fontWeight: 500,
        color: "#000",
    } as React.CSSProperties,
    hr: {
        borderColor: "#E5E5E5",
        margin: "0",
    },
};

const main = {
    backgroundColor: "#ffffff",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
    margin: "10px auto",
    width: "600px",
    maxWidth: "100%",
    border: "1px solid #E5E5E5",
};

const track = {
    container: {
        padding: "22px 40px",
        backgroundColor: "#F7F7F7",
    },
    number: {
        margin: "12px 0 0 0",
        fontWeight: 500,
        lineHeight: "1.4",
        color: "#6F6F6F",
    },
};

const message = {
    padding: "40px 74px",
    textAlign: "center",
} as React.CSSProperties;

const adressTitle = {
    ...paragraph,
    fontSize: "15px",
    fontWeight: "bold",
};

const recomendationsText = {
    margin: "0",
    fontSize: "15px",
    lineHeight: "1",
    paddingLeft: "10px",
    paddingRight: "10px",
};

const recomendations = {
    container: {
        padding: "20px 0",
    },
    product: {
        verticalAlign: "top",
        textAlign: "left" as const,
        paddingLeft: "2px",
        paddingRight: "2px",
    },
    title: { ...recomendationsText, paddingTop: "12px", fontWeight: "500" },
    text: {
        ...recomendationsText,
        paddingTop: "4px",
        color: "#747474",
    },
};

const menu = {
    container: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingTop: "20px",
        backgroundColor: "#F7F7F7",
    },
    content: {
        ...paddingY,
        paddingLeft: "20px",
        paddingRight: "20px",
    },
    title: {
        paddingLeft: "20px",
        paddingRight: "20px",
        fontWeight: "bold",
    },
    text: {
        fontSize: "13.5px",
        marginTop: 0,
        fontWeight: 500,
        color: "#000",
    },
    tel: {
        paddingLeft: "20px",
        paddingRight: "20px",
        paddingBottom: "32px",
    },
};

const footer = {
    policy: {
        width: "166px",
        margin: "auto",
    },
    text: {
        margin: "0",
        color: "#AFAFAF",
        fontSize: "13px",
        textAlign: "center",
    } as React.CSSProperties,
};
