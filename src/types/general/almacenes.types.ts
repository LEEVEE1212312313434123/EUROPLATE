import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type Almacen = Tables<"almacenes">
export type AlmacenInsert = TablesInsert<"almacenes">
export type AlmacenUpdate = TablesUpdate<"almacenes">