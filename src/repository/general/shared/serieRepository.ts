import { supabase } from "@/lib/supabaseClient"

export const serieRepository = {

    async getSerie(tipo_comprobante: string) {

        return supabase
            .from("series_comprobantes")
            .select("*")
            .eq("tipo_comprobante", tipo_comprobante)
            .eq("activo", true)
            .limit(1)
            .single()

    },

    async incrementarNumero(id: number, numeroActual: number) {

        const nuevoNumero = numeroActual + 1

        const { data, error } = await supabase
            .from("series_comprobantes")
            .update({
                numero_actual: nuevoNumero
            })
            .eq("id", id)
            .select()
            .single()

        return { data, error }
    }

}