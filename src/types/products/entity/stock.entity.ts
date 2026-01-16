export interface StockEntity {
  id: number;
  producto_id: number;
  stock_actual: number;
  stock_minimo: number;
  ubicacion: string | null;
}
