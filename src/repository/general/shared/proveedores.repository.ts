// @/repositories/general/proveedores.repository.ts
import { supabase } from "@/lib/supabaseClient"

export const proveedoresRepository = {
    async listar() {
        const { data, error } = await supabase
            .from("proveedores")
            .select("*")
            .order("nombre")
        if (error) throw error
        return data
    },

    async crear(proveedor: any) {
        const { data, error } = await supabase
            .from("proveedores")
            .insert(proveedor)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async editar(id: number, cambios: any) {
        const { data, error } = await supabase
            .from("proveedores")
            .update(cambios)
            .eq("id", id)
            .select()
            .single()
        if (error) throw error
        return data
    },

    async eliminar(id: number) {
        const { error } = await supabase
            .from("proveedores")
            .delete()
            .eq("id", id)
        if (error) throw error
        return true
    }
}