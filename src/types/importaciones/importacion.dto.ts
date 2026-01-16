export interface CreateImportacionDTO {
  num_dua: string;
  estado?: string;

  fechas: {
    llegada: string;       
    entrega?: string;
    vencimiento?: string;
  };

  compra: {
    orden_compra?: string;
    detalle?: string;
  };

  datos_importacion: {
    proveedor?: string;
    agente_aduanas?: string;
    pais_origen?: string;
    puerto_origen?: string;
    puerto_destino?: string;
    container?: string;
  };

  economia: {
    factura?: string;
    unidad?: string;
    cantidad?: number;
    valor_fob_usd?: number;
    transporte_maritimo_usd?: number;
    valor_cfr_usd?: number;
    liquidacion_moneda?: string;
    liquidacion_monto?: number;
  };

  productos: {
    producto_id?: number;
    categoria?: string;
    descripcion?: string;
    cantidad?: number;
    unidad_medida?: string;
    precio_unitario?: number;
    importe_usd?: number;
  }[];

  adjuntos?: {
    url: string;
    nombre_archivo?: string;
  }[];
}
