// types/ventas/venta.relations.ts
import type { VentaEntity } from "@/types/ventas/entity/venta.entity";
import type { VentaProductoEntity } from "@/types/ventas/entity/venta.entity";
import type { ProductEntity } from "@/types/products/entity/product.entity";
import type { ClienteEntity } from "@/types/clientes/entity/cliente.entity";

export interface VentaProductoWithProduct extends VentaProductoEntity {
    cliente: ClienteEntity;
    productos: ProductEntity | null; // Datos del catálogo (nombre, imagen, etc)
}

export interface VentaWithRelations extends VentaEntity {
    venta_productos: VentaProductoWithProduct[];
}