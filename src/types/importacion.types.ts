// src/types/importacion.types.ts

export interface ImportacionAdjunto {
  id?: number;
  url: string;
  nombre_archivo: string;
}

export interface ImportacionProducto {
  id?: number;
  producto_id?: number | null;
  categoria: string;
  descripcion: string;
  cantidad: number;
  unidad_medida: string;
  precio_unitario: number;
  importe_usd: number;
}

export interface Importacion {
  id: number;
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

  adjuntos: ImportacionAdjunto[];
  productos: ImportacionProducto[];
}
