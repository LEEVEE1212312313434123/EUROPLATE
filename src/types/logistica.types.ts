export interface Proveedor {
  nombre: string;
  pais?: string;
}

export interface LogisticaInfo {
  origen: string;
  destino: string;
  estado: string;
  fecha_entrega: string;
}

export interface ProductoMaterial {
  grade: string;
  tipo: string;
  dimensiones: {
    ancho_mm: number;
  };
  gramaje_gsm: number;
  longitud_m: number;
  peso_bruto_kg: number;
}

export interface Producto {
  producto_id: string;
  container: string;
  order: string;
  purchase_order: string;
  seal: string;
  material: ProductoMaterial;
  estado: string;
}

export interface Compra {
  importacion_id: string;
  tipo: "importación" | "nacional";
  descripcion: string;
  proveedor: Proveedor;
  logistica: LogisticaInfo;
  productos: Producto[];
  fecha_registro: string;
  accion: string;
}

export interface CompraFull extends Compra {
  datosEconomicos?: DatosEconomicos;
  datosImportacion?: DatosImportacion;
  adjuntos?: string[];
}