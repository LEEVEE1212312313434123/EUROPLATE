import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type InventarioMovimiento = Tables<"inventario_movimientos">
export type InventarioMovimientoInsert = TablesInsert<"inventario_movimientos">
export type InventarioMovimientoUpdate = TablesUpdate<"inventario_movimientos">