export interface ProductEntity {
  id: number;
  nombre_producto: string;
  categoria: string;
  estado: string;
  accion: string | null;
  fecha_registro: string;
  imagen: string | null;
  tipo: string | null;
  grade: string | null;
  activo: boolean;
}
