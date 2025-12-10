import { ImportacionInventarioRepository } from "@/repository/importacion/importacion.inventario.repository";

class ImportacionInventarioServiceClass {
  async getImportacionesBase() {
    return await ImportacionInventarioRepository.getImportacionesBase();
  }

  async getProductosBase() {
    return await ImportacionInventarioRepository.getProductosBase();
  }

  async getInventarioCompleto() {
    return await ImportacionInventarioRepository.getInventarioCompleto();
  }
}

export const ImportacionInventarioService = new ImportacionInventarioServiceClass();
