import { TipoProductoEnum } from "@/types/products/product-type.enum";

export const PRODUCT_CATEGORIES: Record<TipoProductoEnum, string[]> = {
  [TipoProductoEnum.MERCADERIA]: [
    "Bobinas de cartón",
    "Bobinas de papel",
    "Papel en hojas",
    "Cartón kraft",
  ],

  [TipoProductoEnum.PRODUCTO_TERMINADO]: [
    "Cajas para paquetes",
    "Empaques personalizados",
    "Cajas corrugadas",
  ],

  [TipoProductoEnum.INSUMO]: [
    "Placas de impresión",
    "Tintas",
    "Barnices",
    "Repuestos de máquina",
    "Rodillos",
    "Lubricantes",
  ],
};
