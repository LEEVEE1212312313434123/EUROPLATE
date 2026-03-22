import { supabase } from "@/lib/supabaseClient"
import type {
    ProductoInsert,
    ProductoUpdate
} from "@/types/general/productos.types"

export const productosRepository = {

    async getAll() {
        return supabase
            .from("productos")
            .select("*")
            .order("created_at", { ascending: false })
    },

    async getById(id: number) {
        return supabase
            .from("productos")
            .select("*")
            .eq("id", id)
            .single()
    },

    async create(producto: ProductoInsert) {
        return supabase
            .from("productos")
            .insert(producto)
            .select()
            .single()
    },

    async update(id: number, producto: ProductoUpdate) {
        return supabase
            .from("productos")
            .update(producto)
            .eq("id", id)
            .select()
            .single()
    },

    async delete(id: number) {
        return supabase
            .from("productos")
            .delete()
            .eq("id", id)
    }

}