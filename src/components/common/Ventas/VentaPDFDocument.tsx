// @/components/common/Ventas/VentaPDFDocument.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
    page: { padding: 40, fontSize: 12, fontFamily: 'Helvetica' },
    header: { marginBottom: 20, borderBottom: 1, paddingBottom: 10 },
    title: { fontSize: 20, fontWeight: 'bold' },
    section: { marginBottom: 15 },
    label: { color: '#666', marginBottom: 2 },
    table: { display: 'flex', width: 'auto', marginTop: 20 },
    tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#EEE', paddingVertical: 5 },
    tableColHeader: { width: '40%', fontWeight: 'bold' },
    tableCol: { width: '20%', textAlign: 'right' },
    totalSection: { marginTop: 30, alignItems: 'flex-end' },
    totalRow: { flexDirection: 'row', marginBottom: 5 },
    bold: { fontWeight: 'bold' }
});

export const VentaPDFDocument = ({ venta }: { venta: any }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Encabezado */}
            <View style={styles.header}>
                <Text style={styles.title}>COMPROBANTE DE VENTA</Text>
                <Text>Nro: #{venta.id}</Text>
                <Text>Fecha: {new Date(venta.fecha_venta).toLocaleDateString()}</Text>
            </View>

            {/* Info Cliente */}
            <View style={styles.section}>
                <Text style={styles.label}>Cliente:</Text>
                <Text style={styles.bold}>{venta.cliente?.nombre || "Consumidor Final"}</Text>
            </View>

            {/* Tabla de Productos */}
            <View style={styles.table}>
                <View style={[styles.tableRow, { backgroundColor: '#F9F9F9' }]}>
                    <Text style={styles.tableColHeader}>Producto</Text>
                    <Text style={styles.tableCol}>Cant.</Text>
                    <Text style={styles.tableCol}>P. Unit</Text>
                    <Text style={styles.tableCol}>Subtotal</Text>
                </View>

                {venta.venta_productos?.map((item: any, i: number) => (
                    <View key={i} style={styles.tableRow}>
                        <Text style={styles.tableColHeader}>{item.producto?.nombre_producto}</Text>
                        <Text style={styles.tableCol}>{item.cantidad}</Text>
                        <Text style={styles.tableCol}>{venta.moneda} {item.precio_unitario.toFixed(2)}</Text>
                        <Text style={styles.tableCol}>{venta.moneda} {item.subtotal.toFixed(2)}</Text>
                    </View>
                ))}
            </View>

            {/* Totales */}
            <View style={styles.totalSection}>
                <View style={styles.totalRow}>
                    <Text>Subtotal: </Text>
                    <Text>{venta.moneda} {venta.subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                    <Text>IGV: </Text>
                    <Text>{venta.moneda} {venta.igv.toFixed(2)}</Text>
                </View>
                <View style={[styles.totalRow, { fontSize: 16, marginTop: 10 }]}>
                    <Text style={styles.bold}>TOTAL: </Text>
                    <Text style={styles.bold}>{venta.moneda} {venta.total_monto.toFixed(2)}</Text>
                </View>
            </View>
        </Page>
    </Document>
);