import { supabase } from "@/lib/supabaseClient"

import type {
    ProductoVarianteInsert
} from "@/types/general/producto-variantes.types"

import type {
    VarianteAtributoInsert
} from "@/types/general/variante-atributos.types"

import type {
    AtributoValorInsert
} from "@/types/general/atributo-valores.types"

export const productoVariantesRepository = {

    async create(variante: ProductoVarianteInsert) {
        return supabase
            .from("producto_variantes")
            .insert(variante)
            .select()
            .single()
    },

    async getByProducto(productoId: number) {

        return supabase
            .from("producto_variantes")
            .select(`
            id,
            sku,
            precio_venta,

            variante_atributos (
                atributo_valor_id,
                atributo_valores (
                    id,
                    valor,
                    atributos (
                        id,
                        nombre
                    )
                )
            )
        `)
            .eq("producto_id", productoId)

    },

    async createAtributos(atributos: VarianteAtributoInsert[]) {
        return supabase
            .from("variante_atributos")
            .insert(atributos)
    },

    async getValoresByAtributo(atributoId: number) {
        return supabase
            .from("atributo_valores")
            .select("*")
            .eq("atributo_id", atributoId)
    },

    async findValor(atributoId: number, valor: string) {
        return supabase
            .from("atributo_valores")
            .select("*")
            .eq("atributo_id", atributoId)
            .ilike("valor", valor)
            .maybeSingle()
    },

    async createValor(valor: AtributoValorInsert) {
        return supabase
            .from("atributo_valores")
            .insert(valor)
            .select()
            .single()
    },

    async getAtributosByProducto(productoId: number) {
        return supabase
            .from("producto_atributos")
            .select(`
        atributo_id,
        atributos(
          id,
          nombre
        )
      `)
            .eq("producto_id", productoId)
    },




    async getProductos() {
        return supabase
            .from("productos")
            .select("id,nombre")
            .order("nombre")
    },

    async getAtributos() {
        return supabase
            .from("atributos")
            .select("id,nombre")
            .order("nombre")
    },

    async assignAtributos(productoId: number, atributos: number[]) {

        const rows = atributos.map((atributoId) => ({
            producto_id: productoId,
            atributo_id: atributoId
        }))

        return supabase
            .from("producto_atributos")
            .insert(rows)
    },

    async deleteByProducto(productoId: number) {
        return supabase
            .from("producto_atributos")
            .delete()
            .eq("producto_id", productoId)
    },


    async getValoresByAtributos(atributoIds: number[]) {

        return supabase
            .from("atributo_valores")
            .select("*")
            .in("atributo_id", atributoIds)

    },


    async getByTipo(tipo: string) {

        const { data, error } = await supabase
            .from("productos")
            .select("id, nombre, tipo")
            .eq("tipo", tipo)
            .order("nombre")

        if (error) throw error

        return data
    },

    async getVariantesByTipo() {

        return supabase
            .from("producto_variantes")
            .select(`
            id,
            sku,
            precio_venta,
            productos (
                id,
                nombre,
                tipo,
                maneja_stock,
                es_servicio
            )
        `)
            .eq("activo", true)
            .order("id")

    },

    async getVariantesConAtributos() {
        return supabase
            .from("producto_variantes")
            .select(`
            id,
            sku,
            precio_venta,
            productos (
                nombre
            ),
            variante_atributos (
                atributo_valores (
                    valor,
                    atributos (
                        nombre
                    )
                )
            )
        `)
            .eq("activo", true)
            .order("id");
    },

    async deleteVariante(id: number) {
        return supabase
            .from("producto_variantes")
            .delete()
            .eq("id", id)
    },

    async desactivarVariante(id: number) {
        return supabase
            .from("producto_variantes")
            .update({ activo: false })
            .eq("id", id)
    },

    async tieneMovimientos(varianteId: number) {
        return supabase
            .from("inventario_movimientos")
            .select("id")
            .eq("variante_id", varianteId)
            .limit(1)
    }

}