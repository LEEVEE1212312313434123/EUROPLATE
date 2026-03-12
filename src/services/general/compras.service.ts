import { comprasRepository } from "@/repository/general/compras/compras.repository"
import { compraDetallesRepository } from "@/repository/general/compras/compra-detalles.repository"
import { importacionesRepository } from "@/repository/general/compras/importaciones.repository"
import { compraDocumentosRepository } from "@/repository/general/compras/compra-documentos.repository"
import { inventarioRepository } from "@/repository/general/compras/inventario.repository"
import { processComprasMetrics, prepareComprasChartData } from "@/services/dashboard/compras-dashboard.adapter";

export const comprasService = {
    async registrarCompra({
        compra,
        detalles,
        importacion,
        documentos,
    }: any) {

        // 1️⃣ Crear cabecera de compra
        const { data: compraCreada, error: compraError } = await comprasRepository.create({
            proveedor_id: compra.proveedor_id,
            tipo_compra: compra.tipo_compra,
            fecha: compra.fecha || null,
            estado: "PENDIENTE",

            total: compra.total || 0,
            moneda_id: compra.moneda_id || 1,
            tipo_cambio: compra.tipo_cambio || null
        })

        if (compraError || !compraCreada) {
            throw new Error(compraError?.message || "Error al crear la compra")
        }

        const compraId = compraCreada.id

        // 2️⃣ Crear detalles (Usando los nombres exactos de tu SQL)
        if (detalles?.length > 0) {
            const detallesConCompra = detalles.map((d: any) => ({
                compra_id: compraId,
                variante_id: d.variante_id,
                cantidad: Number(d.cantidad),
                precio: Number(d.precio),
                precio_base: d.precio_base || d.precio,
                moneda_id: d.moneda_id || null,
                almacen_id: d.almacen_id
            }))

            const { error: detallesError } = await compraDetallesRepository.createMany(detallesConCompra)
            if (detallesError) throw new Error(`Error en detalles: ${detallesError.message}`)
        }

        // 3️⃣ Importación
        if (compra.tipo_compra === "IMPORTACION" && importacion) {
            const { error: importError } = await importacionesRepository.create({
                compra_id: compraId,
                incoterm: importacion.incoterm,
                puerto_origen: importacion.puerto_origen,
                puerto_destino: importacion.puerto_destino,

                numero_contenedor: importacion.numero_contenedor,
                agente_aduanas: importacion.agente_aduanas,
                fecha_embarque: importacion.fecha_embarque,
                fecha_llegada: importacion.fecha_llegada,

                costo_flete: importacion.costo_flete,
                costo_seguro: importacion.costo_seguro,
                costo_aduana: importacion.costo_aduana
            })
            if (importError) throw new Error(`Error en importación: ${importError.message}`)
        }

        // 4️⃣ Documentos
        if (documentos?.length > 0) {
            const docs = documentos.map((d: any) => ({
                compra_id: compraId,
                nombre_archivo: d.nombre_archivo,
                tipo_documento: d.tipo_documento
            }))
            const { error: docsError } = await compraDocumentosRepository.createMany(docs)
            if (docsError) throw new Error(`Error en documentos: ${docsError.message}`)
        }

        // 5️⃣ Inventario (Movimientos)
        if (detalles?.length > 0) {
            const movimientos = detalles.map((d: any) => ({
                variante_id: d.variante_id,
                almacen_id: d.almacen_id, // ahora viene del detalle
                tipo_movimiento: "COMPRA",
                cantidad: Number(d.cantidad),
                referencia_id: compraId,
                referencia_tipo: "COMPRA"
            }))

            const { error: inventarioError } = await inventarioRepository.createMovimientos(movimientos)
            if (inventarioError) throw new Error(`Error en inventario: ${inventarioError.message}`)
        }

        return compraCreada
    },


    async obtenerComprasNacionales() {
        const { data, error } = await comprasRepository.getAllWithDetails("NACIONAL");
        if (error) throw new Error(error.message);
        return data;
    },

    async obtenerComprasImportacion() {
        const { data, error } = await comprasRepository.getAllWithDetails("IMPORTACION");
        if (error) throw new Error(error.message);
        return data;
    },

    async obtenerHistorialProductos() {
        const { data, error } = await comprasRepository.getProductosComprados();
        if (error) throw new Error(error.message);
        return data;
    },

    async getDashboardData() {
        const { data, error } = await comprasRepository.getAllWithDetails();
        if (error) throw error;

        return {
            metrics: processComprasMetrics(data || []),
            chart: prepareComprasChartData(data || [])
        };
    }
}