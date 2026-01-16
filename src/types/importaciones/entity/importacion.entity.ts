export interface ImportacionEntity {
  id: number;
  num_dua: string;
  fecha_llegada: string;       
  fecha_entrega: string | null;
  orden_compra: string | null;
  detalle: string | null;

  proveedor: string | null;
  agente_aduanas: string | null;
  pais_origen: string | null;
  puerto_origen: string | null;
  puerto_destino: string | null;
  container: string | null;

  factura: string | null;
  fecha_vencimiento: string | null;
  unidad: string | null;
  cantidad: number | null;
  valor_fob_usd: number | null;
  transporte_maritimo_usd: number | null;
  valor_cfr_usd: number | null;
  liquidacion_moneda: string | null;
  liquidacion_monto: number | null;
  estado: string | null;
  created_at: string;
}
