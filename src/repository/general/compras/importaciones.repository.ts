import { supabase } from "@/lib/supabaseClient"

export const importacionesRepository = {

    async create(importacion: any) {
        return supabase
            .from("importaciones")
            .insert(importacion)
            .select()
            .single()
    }

}