// types/ventas/venta.table.ts
export interface VentaTableItem {
    id: number;
    fecha: string;
    cliente: string;
    monto_total: string; // Formateado ej: "USD 1,500.00"
    cantidad_items: number;
    estado: string;
}