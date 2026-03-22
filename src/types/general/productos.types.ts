import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type Producto = Tables<"productos">
export type ProductoInsert = TablesInsert<"productos">
export type ProductoUpdate = TablesUpdate<"productos">