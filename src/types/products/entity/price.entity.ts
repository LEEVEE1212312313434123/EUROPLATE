export interface PriceEntity {
  id: number;
  producto_id: number;
  precio_min: number | null;
  precio_max: number | null;
  moneda: string | null;
}
