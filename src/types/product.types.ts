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
  peso_kg: number;
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
  grade: string;
  activo: boolean;
}


export interface ProductoBase {
  tempId: number;
  tipo: string;
  dimensiones: string;
  ancho: string;
  largo?: string;
  gramaje: string;
  calibre?: string;
  pliegos?: string;
  unidad: string;
  productName: string;
  grade: string;
  isNew: boolean;
}

//-----------------------

export interface ProductMaterialBobina {
  grade: string; // nombre_producto
  type: string;  // tipo de rollo
  width_cm: number;
  gsm: number;
  unidad_medida: string;
  peso_kg: number;
}

export interface ProductBobina {
  id: number;
  nombre_producto: string; // grade
  categoria: "BobinasCarton";
  material: ProductMaterialBobina;
  precio: ProductPricing;
  almacen: ProductStock;
  estado: string;
  accion: string;
  fecha_registro: string;
  imagen: string;
  tipo: string;
}
