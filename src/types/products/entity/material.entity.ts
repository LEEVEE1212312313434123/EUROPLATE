export interface MaterialEntity {
  id: number;
  producto_id: number;
  tipo: string | null;
  ancho_cm: number | null;
  largo_cm: number | null;
  gramaje_g: number | null;
  calibre: number | null;
  pliegos_por_paquete: number | null;
  unidad_medida: string | null;
  peso_kg: number | null;
}
