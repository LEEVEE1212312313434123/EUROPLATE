import { supabase } from "@/lib/supabaseClient"

export const ventaRepository = {

    async getVentasConNotas() {
        return supabase
            .from("ventas")
            .select(`
                *,
                clientes (
                    id,
                    nombre
                ),
                venta_detalles (
                    id,
                    cantidad,
                    precio,
                    almacen_id,
                    variante_id,
                    producto_variantes (
                        id,
                        sku,
                        codigo_barras,
                        precio_venta,
                        productos (
                            nombre
                        )
                    )
                ),
                venta_pagos (
                    id,
                    metodo_pago,
                    monto
                ),
                venta_notas (
                    id,
                    tipo_nota,
                    motivo,
                    monto,
                    serie,
                    numero,
                    created_at,
                    venta_nota_detalles (
                        variante_id,
                        cantidad,
                        precio
                    )
                )
            `)
            .order("fecha", { ascending: false })
    },

    async createVenta(data: any) {

        return supabase
            .from("ventas")
            .insert(data)
            .select()
            .single()

    },

    async createVentaDetalle(data: any) {

        return supabase
            .from("venta_detalles")
            .insert(data)

    },

    async createVentaPago(data: any) {

        return supabase
            .from("venta_pagos")
            .insert(data)

    },

    async createNotaVenta(data: any) {

        return supabase
            .from("venta_notas")
            .insert(data)
            .select()
            .single()

    },

    async createNotaDetalle(data: any) {

        return supabase
            .from("venta_nota_detalles")
            .insert(data)

    },

    async getDetallesVenta(venta_id: number) {

        return supabase
            .from("venta_detalles")
            .select(`
            variante_id,
            cantidad
        `)
            .eq("venta_id", venta_id)

    },

    async getDevolucionesVenta(venta_id: number) {

        return supabase
            .from("venta_notas")
            .select(`
            id,
            tipo_nota,
            venta_nota_detalles (
                variante_id,
                cantidad
            )
        `)
            .eq("venta_id", venta_id)

    },


    // Añadir al objeto ventaRepository en su archivo correspondiente
    async obtenerNotasPorTipo(tipo: "CREDITO" | "DEBITO") {
        return supabase
            .from("venta_notas")
            .select(`
            *,
            ventas (
                serie,
                numero,
                clientes (
                    nombre
                )
            ),
            venta_nota_detalles (
                cantidad,
                precio,
                variante_id
            )
        `)
            .eq("tipo_nota", tipo)
            .order("created_at", { ascending: false });
    }

}