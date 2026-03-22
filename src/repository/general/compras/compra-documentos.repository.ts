import { supabase } from "@/lib/supabaseClient"

export const compraDocumentosRepository = {

    async createMany(documentos: any[]) {
        return supabase
            .from("compra_documentos")
            .insert(documentos)
    }

}