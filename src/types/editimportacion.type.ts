// =======================================
// Adjuntos
// =======================================
export interface ImportacionAdjunto {
    id?: number;
    importacion_id?: number;
    url: string;
    nombre_archivo?: string;
    created_at?: string;
}

// =======================================
// Productos
// =======================================
export interface ImportacionProducto {
    id?: number;
    importacion_id?: number;
    producto_id?: number | null;
    nombre_producto?: string;

    categoria: string;
    descripcion: string;

    cantidad: number;
    unidad_medida: string;

    precio_unitario: number;
    importe_usd: number;

    // Extras desde inventario
    unidad_producto?: string;
    gramaje_g?: number;
    ancho_cm?: number;
    largo_cm?: number;
    peso_kg?: number;
    precio_min?: number;
    precio_max?: number;
    moneda?: string;
    stock_actual?: number;
    ubicacion?: string;
}

// =======================================
// Estados
// =======================================
export interface EstadoImportacion {
    id?: number;
    importacion_id?: number;

    estado: string;          // lo dejo libre, tu componente no valida por enum
    almacen_id?: number;
    motivo_cancelacion?: string;
    fecha_registro?: string;

    almacen_ubicacion?: string;
}

// =======================================
// Importación principal
// =======================================
export interface Importacion {
    id: number;

    id_importacion?: string;
    num_dua: string;
    fecha_llegada: string;
    fecha_entrega?: string;
    orden_compra?: string;
    detalle?: string;

    proveedor?: string;
    agente_aduanas?: string;
    pais_origen?: string;
    puerto_origen?: string;
    puerto_destino?: string;
    container?: string;

    factura?: string;
    fecha_vencimiento?: string;
    unidad?: string;
    cantidad?: number;
    valor_fob_usd?: number;
    transporte_maritimo_usd?: number;
    valor_cfr_usd?: number;
    liquidacion_moneda?: string;
    liquidacion_monto?: number;

    estado?: string;

    created_at?: string;

    // relaciones — todas OPCIONALES
    adjuntos?: ImportacionAdjunto[];
    productos?: ImportacionProducto[];
    estados?: EstadoImportacion[];
}

// =======================================
// Respuesta del backend
// =======================================
export interface ImportacionDetalleResponse {
    importacion: Importacion;
    productos: ImportacionProducto[];
    adjuntos: ImportacionAdjunto[];
    estados: EstadoImportacion[];
}
