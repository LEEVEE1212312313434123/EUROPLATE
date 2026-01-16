import { ImportacionComprasRepository } from "@/repository/importacion/importacion.compras.repository";

class ImportacionComprasServiceClass {
  async getComprasBase() {
    return await ImportacionComprasRepository.getComprasBase();
  }

  async getCompraDetailById(id: number) {
    return await ImportacionComprasRepository.getCompraDetailById(id);
  }

  async registrarEntrega(importacionId: number, almacenId: number) {
    return await ImportacionComprasRepository.registrarEntrega(importacionId, almacenId);
  }

  async registrarCancelacion(importacionId: number, motivo: string) {
    return await ImportacionComprasRepository.registrarCancelacion(importacionId, motivo);
  }

  async actualizarEstado(id: number, estado: string, options?: any) {
    return await ImportacionComprasRepository.actualizarEstado(id, estado, options);
  }
}

export const ImportacionComprasService = new ImportacionComprasServiceClass();
