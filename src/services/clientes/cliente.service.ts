import { ClienteRepository } from "@/repository/clientes/cliente.repository";
import type { ClienteEntity } from "@/types/clientes/entity/cliente.entity";

class ClienteServiceClass {
    async listarClientes() {
        return await ClienteRepository.getAll();
    }

    async buscarClientes(query: string) {
        if (query.length < 2) return [];
        return await ClienteRepository.searchByName(query);
    }

    async registrarCliente(cliente: Omit<ClienteEntity, "id" | "fecha_registro">) {
        // Validaciones básicas de negocio
        if (cliente.tipo_documento === 'DNI' && cliente.numero_documento.length !== 8) {
            throw new Error("El DNI debe tener 8 dígitos.");
        }
        if (cliente.tipo_documento === 'RUC' && cliente.numero_documento.length !== 11) {
            throw new Error("El RUC debe tener 11 dígitos.");
        }

        // Verificar si el documento ya existe para evitar duplicados
        const existente = await ClienteRepository.getByDocumento(cliente.numero_documento);
        if (existente) {
            throw new Error(`Ya existe un cliente registrado con el número ${cliente.numero_documento}`);
        }

        return await ClienteRepository.create(cliente);
    }

    async obtenerPorDocumento(numero: string) {
        return await ClienteRepository.getByDocumento(numero);
    }
}

export const ClienteService = new ClienteServiceClass();