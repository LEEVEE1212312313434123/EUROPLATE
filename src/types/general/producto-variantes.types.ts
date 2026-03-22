import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type ProductoVariante = Tables<"producto_variantes">
export type ProductoVarianteInsert = TablesInsert<"producto_variantes">
export type ProductoVarianteUpdate = TablesUpdate<"producto_variantes">