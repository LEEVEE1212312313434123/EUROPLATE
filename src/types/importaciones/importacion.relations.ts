import type { ImportacionEntity } from "@/types/importaciones/entity/importacion.entity";
import type { ImportacionAdjuntoEntity } from "@/types/importaciones/entity/importacion.adjunto.entity";
import type { ImportacionProductoEntity } from "@/types/importaciones/entity/importacion.producto.entity";

export interface ImportacionWithRelations extends ImportacionEntity {
  adjuntos: ImportacionAdjuntoEntity[];
  productos: ImportacionProductoEntity[];
}
