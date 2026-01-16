export interface CreateProductDTO {
  nombre_producto: string;
  categoria: string;
  estado: string;
  accion?: string | null;
  imagen?: string | null;
  tipo?: string | null;
  grade?: string | null;
  activo?: boolean;

  material: {
    tipo?: string;
    dimensiones: {
      ancho_cm?: number;
      largo_cm?: number;
    };
    gramaje_g?: number;
    calibre?: number;
    pliegos_por_paquete?: number;
    unidad_medida?: string;
    peso_kg?: number;
  };

  precio: {
    precio_min?: number;
    precio_max?: number;
    moneda?: string;
  };

  almacen: {
    stock_actual: number;
    stock_minimo: number;
    ubicacion?: string;
  };
}
