import { supabase } from "@/lib/supabaseClient"
import type { CompraDetalleInsert } from "@/types/general/compra-detalles.types"

export const compraDetallesRepository = {

    async createMany(detalles: CompraDetalleInsert[]) {
        return supabase
            .from("compra_detalles")
            .insert(detalles)
            .select()
    }

}