// @/services/general/proveedores.service.ts
import { proveedoresRepository } from "@/repository/general/shared/proveedores.repository"

export const proveedoresService = {
    async obtenerTodos() {
        return await proveedoresRepository.listar()
    },

    async guardar(proveedor: any) {
        if (proveedor.id) {
            return await proveedoresRepository.editar(proveedor.id, proveedor)
        }
        return await proveedoresRepository.crear(proveedor)
    },

    async borrar(id: number) {
        return await proveedoresRepository.eliminar(id)
    }
}