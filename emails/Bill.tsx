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

export const BillEmail = () => (
    <Html>
        <Head />
        <Preview>
            Get your order summary, estimated delivery date and more
        </Preview>
        <Body style={main}>
            <Container style={container}>
                <Section style={track.container}>
                    <Row>
                        <Column>
                            <Text style={global.paragraphWithBold}>
                                No. Cuenta de Cobro
                            </Text>
                            <Text style={track.number}>
                                clx5numem000008l0hqys2181
                            </Text>
                        </Column>
                        <Column align="right">
                            <Link style={global.button}>Aceptar</Link>
                        </Column>
                    </Row>
                </Section>
                <Hr style={global.hr} />
                <Section style={message}>
                    <Heading style={global.heading}>
                        Notificación Cuenta de Cobro
                    </Heading>
                    <Text style={global.text}>
                        Estimado(a) Daniel Castillo Giraldo, tu cuenta de cobro
                        ha sido generada con éxito. Puedes revisar el documento
                        adjunto. Si tienes alguna pregunta, no dudes en
                        contactarnos.
                    </Text>
                </Section>
                <Hr style={global.hr} />
                <Section style={global.defaultPadding}>
                    <Text style={adressTitle}>
                        Emisor: Daniel Castillo Giraldo
                    </Text>
                    <Text style={{ ...global.text, fontSize: 14 }}>
                        CC 1002592605
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
                    <Row>
                        <Column
                            style={{
                                verticalAlign: "top",
                            }}
                        >
                            <Text style={{ ...paragraph, fontWeight: "500" }}>
                                Brazil 2022/23 Stadium Away Nike Dri-FIT Soccer
                                Jersey
                            </Text>
                            <Text style={global.text}>Size L (12–14)</Text>
                        </Column>
                        <Column align="right">
                            <Text style={global.text}>$90.00</Text>
                        </Column>
                    </Row>
                </Section>
                <Hr style={global.hr} />
                <Section style={global.defaultPadding}>
                    <Row style={{ display: "inline-flex", marginBottom: 40 }}>
                        <Column style={{ width: "170px" }}>
                            <Text style={global.paragraphWithBold}>
                                No. Cuenta de Cobro
                            </Text>
                            <Text style={track.number}>C0106373851</Text>
                        </Column>
                        <Column style={{ width: "150px" }}>
                            <Text style={global.paragraphWithBold}>
                                Fecha de Emisión
                            </Text>
                            <Text style={track.number}>Sep 22, 2022</Text>
                        </Column>
                        <Column>
                            <Text style={global.paragraphWithBold}>Total</Text>
                            <Text style={track.number}>Sep 22, 2022</Text>
                        </Column>
                    </Row>
                    <Row>
                        <Column align="center">
                            <Link style={global.button}>Aceptar</Link>
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
                                57 3183911339
                            </Text>
                        </Column>
                        <Column>
                            <Text
                                style={{
                                    ...menu.text,
                                    marginBottom: "0",
                                }}
                            >
                                facturas@dcastillogi.com
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
