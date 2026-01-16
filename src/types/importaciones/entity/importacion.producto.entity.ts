export interface ImportacionProductoEntity {
  id: number;
  importacion_id: number;
  producto_id: number | null;

  categoria: string | null;
  descripcion: string | null;

  cantidad: number | null;
  unidad_medida: string | null;

  precio_unitario: number | null;
  importe_usd: number | null;
}
