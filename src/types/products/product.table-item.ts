import type { ProductWithRelations } from "@/types/products/product.relations";

export interface ProductTableItem {
  id: number;
  categoria: string;
  nombre_producto: string;
  tipo: string;
  activo: boolean;

  material: ProductWithRelations["materiales"][0];
  precio: ProductWithRelations["precios"][0];
  almacen: ProductWithRelations["almacenes"][0];
  
  original: ProductWithRelations; 
}
