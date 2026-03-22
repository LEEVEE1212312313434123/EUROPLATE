import { productosRepository } from "@/repository/general/productos.repository"
import { inventarioRepository } from "@/repository/general/compras/inventario.repository"

import type {
    Producto,
    ProductoInsert,
    ProductoUpdate
} from "@/types/general/productos.types"

export const productosService = {

    async listarProductos(): Promise<Producto[]> {

        const { data, error } = await productosRepository.getAll()

        if (error) {
            throw new Error(error.message)
        }

        return data ?? []
    },

    async obtenerProducto(id: number): Promise<Producto> {

        const { data, error } = await productosRepository.getById(id)

        if (error) {
            throw new Error(error.message)
        }

        return data
    },

    async crearProducto(producto: ProductoInsert): Promise<Producto> {

        if (!producto.nombre) {
            throw new Error("El producto necesita un nombre")
        }

        const { data, error } = await productosRepository.create(producto)

        if (error) {
            throw new Error(error.message)
        }

        return data
    },

    async actualizarProducto(
        id: number,
        producto: ProductoUpdate
    ): Promise<Producto> {

        const { data, error } = await productosRepository.update(id, producto)

        if (error) {
            throw new Error(error.message)
        }

        return data
    },

    async eliminarProducto(id: number): Promise<void> {

        const { error } = await productosRepository.delete(id)

        if (error) {
            throw new Error(error.message)
        }

    },



    /**
    * Calcula stock usando movimientos
    */
    async calcularStock(filters: any = {}) {

        const movimientos =
            await inventarioRepository.getMovimientos(filters)

        const stockMap: any = {}

        movimientos.forEach((mov: any) => {

            const key = `${mov.variante_id}_${mov.almacen_id}`

            if (!stockMap[key]) {

                stockMap[key] = {
                    variante_id: mov.variante_id,
                    almacen_id: mov.almacen_id,
                    stock: 0
                }

            }

            stockMap[key].stock += Number(mov.cantidad)

        })

        return Object.values(stockMap)

    },


    /**
     * Stock total de un producto
     */
    async stockProducto(varianteId: number) {

        const movimientos =
            await inventarioRepository.getMovimientos({
                variante_id: varianteId
            })

        const stock = movimientos.reduce(

            (acc: number, mov: any) =>
                acc + Number(mov.cantidad),

            0

        )

        return {
            variante_id: varianteId,
            stock
        }

    },


    /**
     * Cuánto se vendió
     */
    async ventasPeriodo(filters: any = {}) {

        const movimientos =
            await inventarioRepository.getMovimientos({
                ...filters,
                tipo_movimiento: "VENTA"
            })

        const total = movimientos.reduce(

            (acc: number, mov: any) =>
                acc + Math.abs(Number(mov.cantidad)),

            0

        )

        return {
            total_vendido: total
        }

    },


    /**
     * Cuánto se compró
     */
    async comprasPeriodo(filters: any = {}) {

        const movimientos =
            await inventarioRepository.getMovimientos({
                ...filters,
                tipo_movimiento: "COMPRA"
            })

        const total = movimientos.reduce(

            (acc: number, mov: any) =>
                acc + Number(mov.cantidad),

            0

        )

        return {
            total_comprado: total
        }

    }

}