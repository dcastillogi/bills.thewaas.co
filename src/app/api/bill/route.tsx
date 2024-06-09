import ReactPDF from "@react-pdf/renderer";

export const GET = async () => {
    // return it as stream
    const pdfStream = await ReactPDF.renderToStream(<MyDocument />);
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
} from "@react-pdf/renderer";

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
        borderTop: "6px solid black",
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
});

// Create Document Component
const MyDocument = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Cuenta de Cobro</Text>
                <View style={styles.mainInfo}>
                    <View style={styles.semibold}>
                        <Text>Número de Cuenta de Cobro</Text>
                        <Text>Fecha de Emisión</Text>
                        <Text>Fecha de Vencimiento</Text>
                    </View>
                    <View>
                        <Text>clx5numem000008l0hqys2181</Text>
                        <Text>Mayo 28, 2024</Text>
                        <Text>Mayo 29, 2024</Text>
                    </View>
                </View>
                <View style={styles.details}>
                    <View>
                        <Text style={styles.semibold}>
                            Daniel Castillo Giraldo
                        </Text>
                        <Text>C.C. 1002592605</Text>
                        <Text>Carrera 19 #54-04</Text>
                        <Text>Manizales, Caldas</Text>
                        <Text>Colombia</Text>
                        <Text>daniel@dcastillogi.com</Text>
                        <Text>+57 3183911339</Text>
                    </View>
                    <View>
                        <Text style={styles.semibold}>
                            Cuenta de cobro para
                        </Text>
                        <Text>DGL Express S.A.S</Text>
                        <Text>NIT 1002592605-2</Text>
                        <Text>Carrera 19 #54-04</Text>
                        <Text>Manizales, Caldas</Text>
                        <Text>Colombia</Text>
                        <Text>gerenciadglexpress@gmail.com</Text>
                        <Text>+57 3183911339</Text>
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);
