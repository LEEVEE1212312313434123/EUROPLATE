import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Estilos modernos y limpios
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 9,
        fontFamily: "Helvetica",
        color: "#334155",
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottom: 2,
        borderBottomColor: "#e2e8f0",
        paddingBottom: 20,
        marginBottom: 20,
    },
    brandInfo: {
        flexDirection: "column",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    docStatus: {
        fontSize: 10,
        color: "#10b981",
        fontWeight: "bold",
        marginTop: 4,
    },
    infoGrid: {
        flexDirection: "row",
        marginBottom: 30,
        gap: 20,
    },
    infoBlock: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f8fafc",
        borderRadius: 4,
    },
    infoLabel: {
        fontSize: 8,
        color: "#64748b",
        textTransform: "uppercase",
        marginBottom: 4,
        fontWeight: "bold",
    },
    infoValue: {
        fontSize: 10,
        color: "#1e293b",
        fontWeight: "bold",
    },
    table: {
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#1e293b",
        borderRadius: 4,
        padding: 8,
        color: "#ffffff",
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#e2e8f0",
        paddingVertical: 8,
        paddingHorizontal: 4,
    },
    rowEven: {
        backgroundColor: "#fcfcfc",
    },
    colDesc: { width: "50%" },
    colCant: { width: "15%", textAlign: "center" },
    colPru: { width: "15%", textAlign: "right" },
    colSub: { width: "20%", textAlign: "right" },

    adjustmentSection: {
        marginTop: 15,
        padding: 10,
        borderRadius: 4,
    },
    ncBg: { backgroundColor: "#fff1f2", borderLeft: 3, borderLeftColor: "#f43f5e" },
    ndBg: { backgroundColor: "#eff6ff", borderLeft: 3, borderLeftColor: "#3b82f6" },
    adjTitle: { fontSize: 9, fontWeight: "bold", marginBottom: 5 },
    adjRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 8, marginBottom: 2 },

    footerSection: {
        marginTop: 30,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    paymentMethods: {
        width: "50%",
    },
    totalBox: {
        width: "40%",
        gap: 4,
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 2,
    },
    grandTotal: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#0f172a",
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 14,
        fontWeight: "bold",
        color: "#0f172a",
    }
});

export const VentaPDFDocument = ({ venta }: { venta: any }) => {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* ENCABEZADO */}
                <View style={styles.headerContainer}>
                    <View style={styles.brandInfo}>
                        <Text style={styles.title}>{venta.tipo_comprobante}</Text>
                        <Text style={styles.docStatus}>{venta.estado || "Documento"}</Text>
                    </View>
                    <View style={{ textAlign: "right" }}>
                        <Text style={{ fontSize: 14, fontWeight: "bold" }}>#{venta.id}</Text>
                        <Text style={{ color: "#64748b" }}>
                            {new Date(venta.fecha_venta).toLocaleDateString()}
                        </Text>
                    </View>
                </View>

                {/* INFO */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Cliente</Text>
                        <Text style={styles.infoValue}>
                            {venta.cliente?.nombre || "Consumidor Final"}
                        </Text>
                        <Text style={{ fontSize: 8, marginTop: 2 }}>
                            {venta.cliente?.tipo_documento}: {venta.cliente?.numero_documento}
                        </Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Moneda</Text>
                        <Text style={styles.infoValue}>
                            {venta.moneda === "USD" ? "Dólares Americanos" : "Soles Peruanos"} ({venta.moneda})
                        </Text>
                    </View>
                    <View style={styles.infoBlock}>
                        <Text style={styles.infoLabel}>Estado de Pago</Text>
                        <Text style={styles.infoValue}>{venta.estado}</Text>
                    </View>
                </View>

                {/* TABLA */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        <Text style={styles.colDesc}>Descripción</Text>
                        <Text style={styles.colCant}>Cant.</Text>
                        <Text style={styles.colPru}>P. Unit</Text>
                        <Text style={styles.colSub}>Subtotal</Text>
                    </View>

                    {venta.venta_productos?.map((p: any, i: number) => (
                        <View key={p.id} style={[styles.tableRow, i % 2 !== 0 && styles.rowEven]}>
                            <Text style={styles.colDesc}>{p.producto.nombre_producto}</Text>
                            <Text style={styles.colCant}>{p.cantidadDisponible}</Text>
                            <Text style={styles.colPru}>{venta.moneda} {p.precio_unitario.toFixed(2)}</Text>
                            <Text style={styles.colSub}>{venta.moneda} {p.subtotal.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* AJUSTES — SOLO SI EXISTEN */}
                {(venta.notasCredito?.length > 0 || venta.notasDebito?.length > 0) && (
                    <View style={{ flexDirection: "row", gap: 10 }}>
                        {venta.notasCredito?.length > 0 && (
                            <View style={[styles.adjustmentSection, styles.ncBg, { flex: 1 }]}>
                                <Text style={[styles.adjTitle, { color: "#b91c1c" }]}>
                                    Notas de Crédito
                                </Text>
                                {venta.notasCredito.map((n: any) => (
                                    <View key={n.id} style={styles.adjRow}>
                                        <Text>{n.serie_correlativo}</Text>
                                        <Text>-{venta.moneda} {n.monto.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {venta.notasDebito?.length > 0 && (
                            <View style={[styles.adjustmentSection, styles.ndBg, { flex: 1 }]}>
                                <Text style={[styles.adjTitle, { color: "#1d4ed8" }]}>
                                    Notas de Débito
                                </Text>
                                {venta.notasDebito.map((n: any) => (
                                    <View key={n.id} style={styles.adjRow}>
                                        <Text>{n.serie_correlativo}</Text>
                                        <Text>+{venta.moneda} {n.monto.toFixed(2)}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}

                {/* FOOTER */}
                <View style={styles.footerSection}>
                    <View style={styles.paymentMethods}>
                        <Text style={styles.infoLabel}>Detalle de Pago</Text>
                        {venta.metodos_pago?.map((m: any, i: number) => (
                            <Text key={i} style={{ fontSize: 9 }}>
                                • {m.metodo}: {venta.moneda} {m.monto.toFixed(2)}
                            </Text>
                        ))}
                    </View>

                    <View style={styles.totalBox}>
                        <View style={styles.grandTotal}>
                            <Text>TOTAL NETO</Text>
                            <Text>{venta.moneda} {venta.totalAjustado.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
