export interface MetodoPagoDTO {
    metodo: string; // Ej: Efectivo, Transferencia, Yape
    nro_operacion?: string;
    monto: number;
}

export interface CreateVentaDTO {
    cliente_id: number; // Ahora es ID, no string
    tipo_comprobante: 'Boleta' | 'Factura' | 'NotaVenta';
    moneda: string;
    observaciones?: string;

    // Cálculos financieros
    subtotal: number;
    igv: number;
    total_monto: number;

    productos: {
        producto_id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }[];

    pagos: MetodoPagoDTO[];
}