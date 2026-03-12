import { ventaRepository } from "@/repository/general/venta.repository"
import { serieRepository } from "@/repository/general/shared/serieRepository"
import { inventarioRepository } from "@/repository/general/compras/inventario.repository"
import { clienteService } from "@/services/general/shared/cliente.service"

export const ventaService = {

    async obtenerVentas() {

        const { data, error } =
            await ventaRepository.getVentasConNotas()

        if (error) throw new Error(error.message)

        return data
    },

    async crearVenta(payload: any) {

        const {
            venta,
            detalles,
            pagos,
            cliente_data
        } = payload



        if (!venta.cliente_id && cliente_data) {

            const cliente =
                await clienteService.registrarCliente(cliente_data)

            venta.cliente_id = cliente.id
        }



        /* =========================
        1 CALCULAR TOTAL AUTOMATICO
        ========================= */

        let total = 0

        detalles.forEach((d: any) => {
            total += d.cantidad * d.precio
        })

        /* =========================
        VALIDAR PAGOS
        ========================= */

        let totalPagos = 0

        pagos?.forEach((p: any) => {
            totalPagos += p.monto
        })

        let estadoPago = "PENDIENTE"

        if (totalPagos === total)
            estadoPago = "PAGADO"

        if (totalPagos > 0 && totalPagos < total)
            estadoPago = "PARCIAL"

        /* =========================
        2 GENERAR NUMERO COMPROBANTE
        ========================= */

        const { data: serie, error: serieError } =
            await serieRepository.getSerie(venta.tipo_comprobante)

        if (serieError) throw new Error(serieError.message)

        const { data: serieActualizada, error: numeroError } =
            await serieRepository.incrementarNumero(
                serie.id,
                serie.numero_actual
            )

        if (numeroError) throw new Error(numeroError.message)

        const numero = serieActualizada.numero_actual

        const numeroFormateado =
            String(numero).padStart(8, "0")

        if (numeroError) throw new Error(numeroError.message)

        /* =========================
        3 CREAR VENTA
        ========================= */



        const { data: ventaCreada, error } =
            await ventaRepository.createVenta({

                ...venta,
                total,
                estado_pago: estadoPago,
                estado: "COMPLETADO",
                tipo_cambio: venta.tipo_cambio ?? 1,
                serie: serie.serie,
                numero: numeroFormateado

            })

        if (error) throw new Error(error.message)

        const ventaId = ventaCreada.id

        /* =========================
        4 INSERTAR DETALLES
        ========================= */

        const detallesInsert = detalles.map((d: any) => ({
            venta_id: ventaId,
            variante_id: d.variante_id,
            cantidad: d.cantidad,
            precio: d.precio,
            almacen_id: d.almacen_id
        }))

        const { error: detalleError } =
            await ventaRepository.createVentaDetalle(detallesInsert)

        if (detalleError) throw new Error(detalleError.message)

        /* =========================
        5 INSERTAR PAGOS
        ========================= */

        if (pagos?.length) {

            const pagosInsert = pagos.map((p: any) => ({
                venta_id: ventaId,
                metodo_pago: p.metodo_pago,
                monto: p.monto,
                moneda_id: p.moneda_id
            }))

            const { error: pagoError } =
                await ventaRepository.createVentaPago(pagosInsert)

            if (pagoError) throw new Error(pagoError.message)
        }

        /* =========================
        6 CREAR MOVIMIENTOS INVENTARIO
        ========================= */

        const movimientos = detalles.map((d: any) => ({

            variante_id: d.variante_id,
            almacen_id: d.almacen_id,

            tipo_movimiento: "VENTA",

            cantidad: -Math.abs(d.cantidad),

            referencia_id: ventaId,
            referencia_tipo: "VENTA"

        }))

        await inventarioRepository.createMovimientos(movimientos)

        return ventaCreada
    },

    async crearNotaVenta(payload: any) {

        const {
            venta_id,
            tipo_nota,
            motivo,
            detalles
        } = payload

        /* =========================
        VALIDAR DEVOLUCION
        ========================= */

        if (tipo_nota === "CREDITO") {

            const { data: detallesVenta } =
                await ventaRepository.getDetallesVenta(venta_id)

            const { data: devoluciones } =
                await ventaRepository.getDevolucionesVenta(venta_id)

            const mapaVendidos: any = {}

            detallesVenta?.forEach((d: any) => {
                mapaVendidos[d.variante_id] = d.cantidad
            })

            const mapaDevueltos: any = {}

            devoluciones?.forEach((nota: any) => {

                if (nota.tipo_nota !== "CREDITO") return

                nota.venta_nota_detalles?.forEach((d: any) => {

                    if (!mapaDevueltos[d.variante_id])
                        mapaDevueltos[d.variante_id] = 0

                    mapaDevueltos[d.variante_id] += d.cantidad

                })

            })

            detalles.forEach((d: any) => {

                const vendido = mapaVendidos[d.variante_id] ?? 0
                const devuelto = mapaDevueltos[d.variante_id] ?? 0

                const disponible = vendido - devuelto

                if (d.cantidad > disponible) {

                    throw new Error(
                        `No puede devolver más de lo vendido. Disponible: ${disponible}`
                    )

                }

            })

        }

        /* =========================
        1 CALCULAR TOTAL NOTA
        ========================= */

        let monto = 0

        detalles.forEach((d: any) => {
            monto += d.cantidad * d.precio
        })

        /* =========================
        2 GENERAR SERIE NOTA
        ========================= */

        const tipoSerie =
            tipo_nota === "CREDITO"
                ? "NOTA_CREDITO"
                : "NOTA_DEBITO"

        const { data: serie, error: serieError } =
            await serieRepository.getSerie(tipoSerie)

        if (serieError) throw new Error(serieError.message)

        const { data: serieActualizada, error: numeroError } =
            await serieRepository.incrementarNumero(
                serie.id,
                serie.numero_actual
            )

        if (numeroError) throw new Error(numeroError.message)

        const numero =
            String(serieActualizada.numero_actual)
                .padStart(8, "0")

        /* =========================
        3 CREAR NOTA
        ========================= */

        const { data: nota, error } =
            await ventaRepository.createNotaVenta({

                venta_id,
                tipo_nota,
                motivo,
                monto,
                serie: serie.serie,
                numero

            })

        if (error) throw new Error(error.message)

        const notaId = nota.id

        /* =========================
        4 INSERTAR DETALLES NOTA
        ========================= */

        const detallesInsert =
            detalles.map((d: any) => ({

                nota_id: notaId,
                variante_id: d.variante_id,
                cantidad: d.cantidad,
                precio: d.precio

            }))

        await ventaRepository.createNotaDetalle(detallesInsert)

        /* =========================
        5 MOVIMIENTO INVENTARIO
        SOLO PARA NOTA CREDITO
        ========================= */

        if (tipo_nota === "CREDITO") {

            const movimientos =
                detalles.map((d: any) => ({

                    variante_id: d.variante_id,
                    almacen_id: d.almacen_id,

                    tipo_movimiento: "AJUSTE",

                    cantidad: Math.abs(d.cantidad),

                    referencia_id: notaId,
                    referencia_tipo: "NOTA_CREDITO"

                }))

            await inventarioRepository
                .createMovimientos(movimientos)

        }

        return nota

    },

    async obtenerNotasCredito() {
        const { data, error } = await ventaRepository.obtenerNotasPorTipo("CREDITO");
        if (error) throw new Error(error.message);
        return data;
    },

    async obtenerNotasDebito() {
        const { data, error } = await ventaRepository.obtenerNotasPorTipo("DEBITO");
        if (error) throw new Error(error.message);
        return data;
    }

}