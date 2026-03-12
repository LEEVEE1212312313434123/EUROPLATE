import { almacenesRepository } from "@/repository/general/shared/almacenes.repository"

export const almacenesService = {

    async obtenerTodos() {

        const { data, error } =
            await almacenesRepository.getAll()

        if (error) throw new Error(error.message)

        return data ?? []

    },

    async obtenerPorId(id: number) {

        const { data, error } =
            await almacenesRepository.getById(id)

        if (error) throw new Error(error.message)

        return data

    }

}