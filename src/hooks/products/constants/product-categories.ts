import { TipoProductoEnum } from "@/types/products/product-type.enum";

export const PRODUCT_CATEGORIES = {
  [TipoProductoEnum.MATERIA_PRIMA]: [
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
  [TipoProductoEnum.INSUMO_PRODUCCION]: [
    "Placas de impresión",
    "Tintas",
    "Barnices",
  ],
  [TipoProductoEnum.SUMINISTRO_TECNICO]: [
    "Repuestos de máquina",
    "Rodillos",
    "Lubricantes",
  ],
} as const;
