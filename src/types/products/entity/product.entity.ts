import type { TipoProductoEnum } from "../product-type.enum";

export interface ProductEntity {
  id: number;
  nombre_producto: string;
  categoria: string;
  tipo_producto: TipoProductoEnum | null; 
  estado: string;
  accion: string | null;
  fecha_registro: string;
  imagen: string | null;
  tipo: string | null;
  grade: string | null;
  activo: boolean;
}