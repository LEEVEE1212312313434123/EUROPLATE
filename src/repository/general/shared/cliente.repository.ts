import { supabase } from "@/lib/supabaseClient"

export const clientesRepository = {
    // Obtener todos los clientes ordenados por nombre
    async getAll() {
        return supabase
            .from("clientes")
            .select("*")
            .order("nombre", { ascending: true });
    },

    // Crear un nuevo cliente
    async create(data: {
        nombre: string;
        telefono?: string;
        email?: string;
        direccion?: string
    }) {
        return supabase
            .from("clientes")
            .insert(data)
            .select()
            .single();
    },

    // Opcional: Obtener un cliente por ID (muy útil para detalles)
    async getById(id: number) {
        return supabase
            .from("clientes")
            .select("*")
            .eq("id", id)
            .single();
    }
}