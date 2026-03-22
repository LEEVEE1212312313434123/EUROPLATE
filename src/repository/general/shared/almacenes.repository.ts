import { supabase } from "@/lib/supabaseClient"

export const almacenesRepository = {

    async getAll() {

        return supabase
            .from("almacenes")
            .select("id,nombre,ubicacion")
            .order("nombre")

    },

    async getById(id: number) {

        return supabase
            .from("almacenes")
            .select("*")
            .eq("id", id)
            .single()

    }

}