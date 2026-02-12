export interface TipoCambioEntity {
    id: number;
    moneda_origen_id: number;
    moneda_destino_id: number;
    fecha: string; // YYYY-MM-DD
    compra: number;
    venta: number;
    created_at?: string;
}
