import { supabase } from "@/lib/supabaseClient"

export const inventarioRepository = {

    async createMovimientos(movimientos: any[]) {
        return supabase
            .from("inventario_movimientos")
            .insert(movimientos)
    },

    async getMovimientos(filters: any = {}) {

        let query = supabase
            .from("inventario_movimientos")
            .select(`
                variante_id,
                almacen_id,
                cantidad,
                tipo_movimiento,
                created_at
            `)

        if (filters.variante_id)
            query = query.eq("variante_id", filters.variante_id)

        if (filters.almacen_id)
            query = query.eq("almacen_id", filters.almacen_id)

        if (filters.tipo_movimiento)
            query = query.eq("tipo_movimiento", filters.tipo_movimiento)

        if (filters.fecha_desde)
            query = query.gte("created_at", filters.fecha_desde)

        if (filters.fecha_hasta)
            query = query.lte("created_at", filters.fecha_hasta)

        const { data, error } = await query

        if (error) throw error

        return data
    }

}