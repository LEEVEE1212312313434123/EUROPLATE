import type { Tables, TablesInsert, TablesUpdate } from "./../database.types"

export type Proveedor = Tables<"proveedores">
export type ProveedorInsert = TablesInsert<"proveedores">
export type ProveedorUpdate = TablesUpdate<"proveedores">