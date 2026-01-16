import type { ProductEntity } from "@/types/products/entity/product.entity";
import type { MaterialEntity } from "@/types/products/entity/material.entity";
import type { PriceEntity } from "@/types/products/entity/price.entity";
import type { StockEntity } from "@/types/products/entity/stock.entity";

export interface ProductWithRelations extends ProductEntity {
  materiales: MaterialEntity[];
  precios: PriceEntity[];
  almacenes: StockEntity[];
}
