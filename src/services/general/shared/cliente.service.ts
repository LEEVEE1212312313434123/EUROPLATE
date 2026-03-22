import { clientesRepository } from "@/repository/general/shared/cliente.repository"

export const clienteService = {

    // Lista todos los clientes
    async listarClientes() {
        const { data, error } = await clientesRepository.getAll();

        if (error) {
            console.error("Error al listar clientes:", error.message);
            throw new Error(error.message);
        }

        return data;
    },

    // Crea un cliente validando datos mínimos
    async registrarCliente(clienteData: {
        nombre: string;
        telefono?: string;
        email?: string;
        direccion?: string
    }) {
        // Ejemplo de lógica de negocio: Validar que el nombre no esté vacío
        if (!clienteData.nombre || clienteData.nombre.trim() === "") {
            throw new Error("El nombre del cliente es obligatorio.");
        }

        const { data, error } = await clientesRepository.create(clienteData);

        if (error) {
            console.error("Error al crear cliente:", error.message);
            throw new Error(error.message);
        }

        return data;
    }
}