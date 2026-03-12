import { supabase } from "@/lib/supabaseClient"

export const tiposCambioRepository = {

    async getUltimoTipoCambio() {
        return supabase
            .from("tipos_cambio")
            .select("*")
            .order("fecha", { ascending: false })
            .limit(1)
            .single()
    },

    async create(data: any) {
        return supabase
            .from("tipos_cambio")
            .insert(data)
            .select()
            .single()
    },

    async getMonedas() {
        const { data, error } = await supabase
            .from("monedas")
            .select("id, codigo, nombre, simbolo")
            .order("nombre");

        if (error) throw error;
        return data;
    }

}