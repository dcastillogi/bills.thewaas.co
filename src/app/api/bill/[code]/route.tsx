import clientPromise from "@/lib/mongodb";
import { toMoneyFormat } from "@/lib/utils";
import ReactPDF from "@react-pdf/renderer";

export const GET = async (req: Request) => {
    const billId = req.url.split("/").pop();
    const client = await clientPromise;
    const db = await client.db("main");
    const bills = await db.collection("bills");
    const bill = await bills.findOne({ _id: new ObjectId(billId) });
    if (!bill) {
        return new Response(JSON.stringify({ message: "Bill not found" }), {
            status: 404,
        });
    }
    // return it as stream
    const pdfStream = await ReactPDF.renderToStream(
        <MyDocument
            bill={{
                _id: bill._id.toString(),
                emittedAt: new Date(bill.emittedAt).toLocaleDateString(
                    "es-CO",
                    { year: "numeric", month: "long", day: "numeric" }
                ),
                currency: bill.currency,
                expiresAt: new Date(bill.expiresAt).toLocaleDateString(
                    "es-CO",
                    { year: "numeric", month: "long", day: "numeric" }
                ),
                issuer: {
                    name: bill.issuer.name,
                    document: bill.issuer.document,
                    email: bill.issuer.email,
                    phone: bill.issuer.phone,
                    address: bill.issuer.address,
                    city: bill.issuer.city,
                    country: bill.issuer.country,
                    zip: bill.issuer.zip,
                    photoUrl: bill.issuer.photoUrl,
                    color: bill.issuer.color,
                },
                recipient: {
                    contact: bill.recipient.contact,
                    document: bill.recipient.document,
                    name: bill.recipient.name,
                    email: bill.recipient.email,
                    phone: bill.recipient.phone,
                    address: bill.recipient.address,
                    city: bill.recipient.city,
                    country: bill.recipient.country,
                    zip: bill.recipient.zip,
                },
                products: bill.products,
                subtotal: bill.subtotal,
                total: bill.total,
                payments: bill.payments,
            }}
        />
    );
    // Return it as a response
    return new Response(pdfStream as any, {
        headers: {
            "Content-Type": "application/pdf",
        },
    });
};

import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font,
    Image,
} from "@react-pdf/renderer";
import { ObjectId } from "mongodb";

Font.register({
    family: "Inter",
    fonts: [
        { src: `${process.env.HOST}/fonts/Inter-Regular.ttf` },
        {
            src: `${process.env.HOST}/fonts/Inter-SemiBold.ttf`,
            fontWeight: 600,
        },
        { src: `${process.env.HOST}/fonts/Inter-Medium.ttf`, fontWeight: 500 },
    ],
});

// Create styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: "white",
        fontFamily: "Inter",
    },
    section: {
        margin: 10,
        padding: 20,
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 600,
    },
    mainInfo: {
        flexDirection: "row",
        gap: 12,
        marginTop: 40,
        fontSize: 10,
        lineHeight: 1.5,
    },
    payments: {
        marginTop: 10,
        fontSize: 10,
        lineHeight: 1.5,
    },
    payment: {
        flexDirection: "row",
        gap: 20,
        marginTop: 5,
    },
    details: {
        flexDirection: "row",
        gap: 100,
        marginTop: 30,
        fontSize: 10,
        lineHeight: 1.5,
    },
    semibold: {
        fontWeight: 600,
    },
    table: {
        fontSize: 10,
        marginTop: 50,
    },
    totalTable: {
        fontSize: 10,
        marginTop: 20,
        paddingLeft: 350,
    },
    col1: {
        width: 300,
        paddingRight: 20,
    },
    col2: {
        width: 50,
    },
    col3: {
        width: 80,
    },
    col4: {
        width: 100,
        textAlign: "right",
    },
    secondary: {
        color: "#666",
        fontSize: 9,
        marginTop: 5,
    },
    row: {
        flexDirection: "row",
        paddingTop: 12,
        paddingBottom: 15,
        borderBottom: "0.7px solid #D9D9D9",
    },
    tableRow: {
        flexDirection: "row",
        borderBottom: "0.7px solid #D9D9D9",
        paddingVertical: 6,
    },
    lastCol: {
        width: 150,
        textAlign: "right",
    },
    footer: {
        position: "absolute",
        fontSize: 9,
        bottom: 20,
        paddingHorizontal: 30,
        width: "100%",
        right: 0,
        color: "grey",
        flexDirection: "row",
        justifyContent: "space-between",
    },
});

// Create Document Component
const MyDocument = ({
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
            photoUrl: string;
            color: string;
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
        payments: any[];
    };
}) => (
    <Document>
        <Page
            size="A4"
            style={{
                ...styles.page,
                borderTop: `6px solid ${bill.issuer.color}`,
            }}
        >
            <View style={styles.section}>
                <View>
                    <Text style={styles.title}>Cuenta de Cobro</Text>
                    {/* eslint-disable-next-line */}
                    <Image
                        src={bill.issuer.photoUrl}
                        style={{
                            width: 100,
                            height: 100,
                            position: "absolute",
                            right: 0,
                            top: -20,
                        }}
                    />
                </View>
                <View style={styles.mainInfo}>
                    <View style={styles.semibold}>
                        <Text>Número de Cuenta de Cobro</Text>
                        <Text>Fecha de Emisión</Text>
                        <Text>Fecha de Vencimiento</Text>
                    </View>
                    <View>
                        <Text>{bill._id}</Text>
                        <Text>{bill.emittedAt}</Text>
                        <Text>{bill.expiresAt}</Text>
                    </View>
                </View>
                <View style={styles.details}>
                    <View>
                        <Text style={styles.semibold}>{bill.issuer.name}</Text>
                        <Text>{bill.issuer.document}</Text>
                        <Text>{bill.issuer.address}</Text>
                        <Text>{bill.issuer.city}</Text>
                        <Text>{bill.issuer.country}</Text>
                        <Text>{bill.issuer.email}</Text>
                        <Text>{bill.issuer.phone}</Text>
                    </View>
                    <View>
                        <Text style={styles.semibold}>
                            Cuenta de cobro para
                        </Text>
                        <Text>{bill.recipient.name}</Text>
                        <Text>{bill.recipient.document}</Text>
                        <Text>{bill.recipient.address}</Text>
                        <Text>{bill.recipient.city}</Text>
                        <Text>{bill.recipient.country}</Text>
                        <Text>{bill.recipient.email}</Text>
                        <Text>{bill.recipient.phone}</Text>
                    </View>
                </View>
                <View style={styles.table}>
                    <View
                        style={{
                            flexDirection: "row",
                            borderBottom: "0.6px solid black",
                            paddingBottom: 5,
                            fontSize: 8,
                        }}
                    >
                        <Text style={{ ...styles.col1 }}>Descripción</Text>
                        <Text style={{ ...styles.col2 }}>Cant.</Text>
                        <Text style={{ ...styles.col3 }}>Precio U.</Text>
                        <Text style={{ ...styles.col4 }}>Total</Text>
                    </View>
                    {bill.products.map((product: any, index: number) => (
                        <View style={styles.row} key={`row-product-${index}`}>
                            <View style={styles.col1}>
                                <Text style={styles.semibold}>
                                    {product.title}
                                </Text>
                                {product.description &&
                                    product.description.length > 1 && (
                                        <Text style={styles.secondary}>
                                            {product.description}
                                        </Text>
                                    )}
                            </View>
                            <Text style={styles.col2}>{product.quantity}</Text>
                            <Text style={styles.col3}>
                                {toMoneyFormat(product.price, bill.currency)}
                            </Text>
                            <Text style={styles.col4}>
                                {toMoneyFormat(product.total, bill.currency)}
                            </Text>
                        </View>
                    ))}
                </View>
                <View style={styles.totalTable}>
                    <View style={styles.tableRow}>
                        <Text style={styles.col2}>Subtotal</Text>
                        <Text style={styles.lastCol}>
                            {toMoneyFormat(bill.subtotal, bill.currency)}
                        </Text>
                    </View>
                    <View style={{ ...styles.tableRow, ...styles.semibold }}>
                        <Text style={styles.col2}>Total</Text>
                        <Text style={styles.lastCol}>
                            {toMoneyFormat(bill.total, bill.currency)}
                        </Text>
                    </View>
                </View>
                <View style={styles.payments}>
                    {bill.payments.map((payment: any, index: number) => (
                        <View
                            style={styles.payment}
                            key={`row-payment-${index}`}
                        >
                            <Text style={styles.semibold}>
                                Pago {index + 1}{" "}
                                ({new Date(payment.date).toLocaleDateString(
                                    "es-CO"
                                )})
                                :
                            </Text>
                            <Text>
                                {toMoneyFormat(payment.amount, bill.currency)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
            <View style={styles.footer} fixed>
                <Text>
                    {bill._id} · {toMoneyFormat(bill.total, bill.currency)}.
                    Generado por Bills by The Waas Co.
                </Text>
                <Text
                    render={({ pageNumber, totalPages }) =>
                        `Página ${pageNumber} de ${totalPages}`
                    }
                />
            </View>
        </Page>
    </Document>
);
