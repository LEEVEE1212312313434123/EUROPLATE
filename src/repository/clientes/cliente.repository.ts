import { supabase } from "@/lib/supabaseClient";
import type { ClienteEntity } from "@/types/clientes/entity/cliente.entity";

export class ClienteRepository {
    // Obtener todos los clientes ordenados por nombre
    static async getAll(): Promise<ClienteEntity[]> {
        const { data, error } = await supabase
            .from("clientes")
            .select("*")
            .order("nombre", { ascending: true });

        if (error) throw new Error(error.message);
        return data || [];
    }

    // Buscar por DNI o RUC (exacto)
    static async getByDocumento(numero: string): Promise<ClienteEntity | null> {
        const { data, error } = await supabase
            .from("clientes")
            .select("*")
            .eq("numero_documento", numero)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    // Búsqueda predictiva para el selector de la UI
    static async searchByName(query: string): Promise<ClienteEntity[]> {
        const { data, error } = await supabase
            .from("clientes")
            .select("*")
            .ilike("nombre", `%${query}%`)
            .limit(10);

        if (error) throw new Error(error.message);
        return data || [];
    }

    // Crear un nuevo cliente
    static async create(cliente: Omit<ClienteEntity, "id" | "fecha_registro">): Promise<ClienteEntity> {
        const { data, error } = await supabase
            .from("clientes")
            .insert([cliente])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    // Actualizar datos del cliente
    static async update(id: number, cambios: Partial<ClienteEntity>): Promise<void> {
        const { error } = await supabase
            .from("clientes")
            .update(cambios)
            .eq("id", id);

        if (error) throw new Error(error.message);
    }
}