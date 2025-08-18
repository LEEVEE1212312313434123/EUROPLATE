export interface ProductMaterial {
  tipo: string;
  dimensiones: {
    ancho_cm: number;
    largo_cm: number;
  };
  gramaje_g: number;
  calibre: number;
  pliegos_por_paquete: number;
  unidad_medida: string;
}

export interface ProductPricing {
  precio_min: number;
  precio_max: number;
  moneda: string;
}

export interface ProductStock {
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string;
}

export interface Product {
  id: number;
  nombre_producto: string;
  categoria: string;
  material: ProductMaterial;
  precio: ProductPricing;
  almacen: ProductStock;
  estado: string;
  accion: string;
  fecha_registro: string;
  imagen: string;
  tipo: string;
}
