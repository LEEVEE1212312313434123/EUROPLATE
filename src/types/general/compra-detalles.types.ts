import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type CompraDetalle = Tables<"compra_detalles">
export type CompraDetalleInsert = TablesInsert<"compra_detalles">
export type CompraDetalleUpdate = TablesUpdate<"compra_detalles">