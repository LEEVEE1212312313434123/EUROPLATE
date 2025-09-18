// Representa UNA sola orden de importación completa
export interface OrdenImportacion {
    datosGenerales: DatosGenerales;
    datosImportacion: DatosImportacion;
    datosEconomicos: DatosEconomicos;
    adjuntos: string[]; // URLs de archivos PDF (máx 5)
    productos: Producto[];
}

// =======================
// SUB-TIPOS
// =======================

export interface DatosGenerales {
    numImportacion: string;
    fechaPedido: string;   // formato YYYY-MM-DD
    fechaEntrega: string;  // formato YYYY-MM-DD
    purchaseOrder: string;
    detalle: string;
}

export interface DatosImportacion {
    proveedor: string;
    agente: string;
    origen: string;
    destino: string;
    puertoOrigen: string;
    puertoDestino: string;
    transportista: string;
    aseguradora: string;
}

export interface DatosEconomicos {
    factura: string;
    fechaVencimiento: string; // formato YYYY-MM-DD
    cantidad: number;
    unidad: string; // Ej: "MT"
    valorFOB: number;
    transporteMaritimo: number;
    valorCFR: number;
    liquidacion: Liquidacion;
}

export interface Liquidacion {
    moneda: "USD" | "PEN";
    monto: number;
}

export interface Producto {
    order: string;
    grade: string;
    type: string;
    width: string;
    gsm: string;
    lMetre: string;
    productId: string;
    grossNetWt: string; // formato "gross/net"
}
