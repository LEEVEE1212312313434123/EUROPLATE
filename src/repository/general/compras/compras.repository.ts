import { supabase } from "@/lib/supabaseClient"
import type { CompraInsert } from "@/types/general/compras.types"

export const comprasRepository = {

    async create(compra: CompraInsert) {
        return supabase
            .from("compras")
            .insert(compra)
            .select()
            .single()
    },

    // En compras.repository.ts
    async getAllWithDetails(tipo?: "NACIONAL" | "IMPORTACION") {
        let query = supabase
            .from("compras")
            .select(`
            *,
            proveedores (
                id,
                nombre,
                pais,   
                email
            ),
            compra_detalles (
                id,
                cantidad,
                precio,
                variante_id
            ),
            importaciones ( 
                incoterm,
                puerto_origen,
                puerto_destino,
                fecha_llegada,
                costo_flete,   
                costo_seguro,  
                costo_aduana   
            )
        `)
            .order("fecha", { ascending: false });

        if (tipo) {
            query = query.eq("tipo_compra", tipo);
        }

        return query;
    },

    async getProductosComprados() {
        const { data, error } = await supabase
            .from("compra_detalles")
            .select(`
            id,
            cantidad,
            precio,
            precio_base,
            compra_id,
            compras (
                fecha,
                tipo_compra,
                proveedores (nombre)
            ),
            producto_variantes (
                sku,
                productos (nombre)
            )
        `)
            .order('id', { ascending: false });

        return { data, error };
    }

}