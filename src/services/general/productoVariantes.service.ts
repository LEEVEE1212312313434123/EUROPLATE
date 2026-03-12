import { productoVariantesRepository } from "@/repository/general/productoVariantes.repository"

import type {
    ProductoVariante
} from "@/types/general/producto-variantes.types"

export type CrearVarianteInput = {
    producto_id: number
    sku?: string
    codigo_barras?: string
    precio_venta?: number
    activo?: boolean
    atributos: {
        atributo_id: number
        valor: string
    }[]
}

export const productoVariantesService = {

    async obtenerOCrearValor(
        atributoId: number,
        valor: string
    ): Promise<number> {

        const { data: existente } =
            await productoVariantesRepository.findValor(
                atributoId,
                valor
            )

        if (existente) {
            return existente.id
        }

        const { data: nuevo, error } =
            await productoVariantesRepository.createValor({
                atributo_id: atributoId,
                valor
            })

        if (error) throw new Error(error.message)

        return nuevo.id

    },

    async crearVariante(input: CrearVarianteInput): Promise<ProductoVariante> {

        const { atributos, ...varianteData } = input

        const { data: variante, error } =
            await productoVariantesRepository.create(varianteData)

        if (error) throw new Error(error.message)

        if (!variante) {
            throw new Error("No se pudo crear la variante")
        }

        const atributosInsert = []

        for (const attr of atributos) {

            const valorId =
                await this.obtenerOCrearValor(
                    attr.atributo_id,
                    attr.valor
                )

            atributosInsert.push({
                variante_id: variante.id,
                atributo_valor_id: valorId
            })

        }

        if (atributosInsert.length > 0) {

            const { error: attrError } =
                await productoVariantesRepository.createAtributos(
                    atributosInsert
                )

            if (attrError) {
                throw new Error(attrError.message)
            }

        }

        return variante

    },

    async listarVariantes(productoId: number) {

        const { data, error } =
            await productoVariantesRepository.getByProducto(productoId)

        if (error) throw new Error(error.message)

        if (!data) return []

        return data.map((v: any) => ({

            id: v.id,
            sku: v.sku,
            precio_venta: v.precio_venta,

            atributos:
                v.variante_atributos?.map((a: any) => ({
                    nombre: a.atributo_valores?.atributos?.nombre,
                    valor: a.atributo_valores?.valor
                })) ?? []

        }))

    },

    async obtenerAtributos(productoId: number) {

        const { data, error } =
            await productoVariantesRepository.getAtributosByProducto(productoId)

        if (error) throw new Error(error.message)

        if (!data) return []

        return data
            .map((item: any) => item.atributos)
            .filter(Boolean)

    },



    async obtenerProductos() {

        const { data, error } =
            await productoVariantesRepository.getProductos()

        if (error) throw new Error(error.message)

        return data ?? []

    },

    async obtenerAtributosGlobales() {

        const { data, error } =
            await productoVariantesRepository.getAtributos()

        if (error) throw new Error(error.message)

        return data ?? []

    },

    async asignarAtributosProducto(
        productoId: number,
        atributos: number[]
    ) {

        await productoVariantesRepository.deleteByProducto(productoId)

        const { error } =
            await productoVariantesRepository.assignAtributos(
                productoId,
                atributos
            )

        if (error) throw new Error(error.message)

    },


    async obtenerValoresPorAtributos(atributoIds: number[]) {

        const { data, error } =
            await productoVariantesRepository.getValoresByAtributos(atributoIds)

        if (error) throw new Error(error.message)

        const mapping: Record<number, any[]> = {}

        for (const val of data ?? []) {

            if (!mapping[val.atributo_id]) {
                mapping[val.atributo_id] = []
            }

            mapping[val.atributo_id].push(val)

        }

        return mapping

    },


    async obtenerPorTipo(tipo: string) {

        return await productoVariantesRepository.getByTipo(tipo)

    },

    async obtenerVariantesPorTipo() {

        const { data, error } =
            await productoVariantesRepository.getVariantesByTipo()

        if (error) throw new Error(error.message)

        if (!data) return []

        return data.map((v: any) => ({
            id: v.id,
            sku: v.sku,
            precio_venta: v.precio_venta,
            producto_nombre: v.productos?.nombre
        }))

    },



    async obtenerVariantesFormateadas() {
        const { data, error } = await productoVariantesRepository.getVariantesConAtributos();

        if (error) throw new Error(error.message);

        return data.map((v: any) => ({
            id: v.id,
            sku: v.sku,
            precio_venta: v.precio_venta,
            producto_nombre: v.productos?.nombre,
            // Aquí transformamos el array de atributos en un string o array simple
            caracteristicas: v.variante_atributos?.map((at: any) => ({
                nombre: at.atributo_valores?.atributos?.nombre,
                valor: at.atributo_valores?.valor
            })) || []
        }));
    }
}