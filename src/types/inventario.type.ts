
export interface Inventario {
    importacion_producto_id: number; // id en importacion_productos
    num_dua: string | null;
    orden_compra: string | null;
    producto_id: number | null;
    nombre_producto: string | null;
    categoria: string | null;
    unidad_medida: string | null;
    gramaje_g: number | null;
    ancho_cm: number | null;
    largo_cm: number | null;
    peso_kg: number | null;
    precio_min: number | null;
    precio_max: number | null;
    moneda: string | null;
    stock_actual: number | null;
    ubicacion: string | null;
    cantidad: number | null;        // cantidad importada
    precio_unitario: number | null; // precio por unidad
    importe_usd: number | null;     // total (cantidad * precio_unitario)
}
