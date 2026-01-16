import { ImportacionRepository } from "@/repository/importacion/importacion.repository";
import type { CreateImportacionDTO } from "@/types/importaciones/importacion.dto";
import type { ImportacionWithRelations } from "@/types/importaciones/importacion.relations";

class ImportacionServiceClass {
  async getAll(): Promise<ImportacionWithRelations[]> {
    return await ImportacionRepository.getAll();
  }

  async getById(id: number): Promise<ImportacionWithRelations | null> {
    return await ImportacionRepository.getById(id);
  }

  async create(dto: CreateImportacionDTO): Promise<number> {
    const importacionId = await ImportacionRepository.create(dto);

    await ImportacionRepository.insertAdjuntos(importacionId, dto.adjuntos);
    await ImportacionRepository.insertProductos(importacionId, dto.productos);

    return importacionId;
  }

  async update(id: number, dto: Partial<CreateImportacionDTO>) {
    await ImportacionRepository.update(id, dto);

    if (dto.adjuntos || dto.productos) {
      await ImportacionRepository.clearChildren(id);

      if (dto.adjuntos) {
        await ImportacionRepository.insertAdjuntos(id, dto.adjuntos);
      }
      if (dto.productos) {
        await ImportacionRepository.insertProductos(id, dto.productos);
      }
    }
  }

  async delete(id: number) {
    return await ImportacionRepository.delete(id);
  }
}

export const ImportacionService = new ImportacionServiceClass();
