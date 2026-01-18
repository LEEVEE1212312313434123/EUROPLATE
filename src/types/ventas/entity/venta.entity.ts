// types/ventas/entity/venta.entity.ts
export interface VentaEntity {
    id: number;
    cliente: string;
    fecha_venta: string; // timestamp
    total_monto: number;
    moneda: string;
    estado: string;
    observaciones: string | null;
}

// types/ventas/entity/venta-producto.entity.ts
export interface VentaProductoEntity {
    id: number;
    venta_id: number;
    producto_id: number | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface ClienteEntity {
    id: number;
    nombre: string;
    tipo_documento: 'DNI' | 'RUC';
    numero_documento: string;
    telefono?: string;
    email?: string;
    fecha_registro: string;
}