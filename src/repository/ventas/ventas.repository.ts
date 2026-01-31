import { supabase } from "@/lib/supabaseClient";
import type { CreateVentaDTO } from "@/types/ventas/venta.dto";

export class VentasRepository {

    // Obtener todas las ventas con sus productos
    static async getAll() {
        const { data, error } = await supabase
            .from("ventas")
            .select(`
            *,
            cliente:clientes (nombre) 
        `) // <-- Esto hace el JOIN con la tabla clientes
            .order("id", { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    static async delete(id: number) {
        const { error } = await supabase.from("ventas").delete().eq("id", id);
        if (error) throw error;
        return true;
    }

    // Crear una venta completa (Cabecera + Detalle)
    static async registrarVenta(dto: CreateVentaDTO) {
        // 1. Insertar Cabecera con los nuevos campos
        const { data: venta, error: errorVenta } = await supabase
            .from("ventas")
            .insert([{
                cliente_id: dto.cliente_id,
                tipo_comprobante: dto.tipo_comprobante,
                subtotal: dto.subtotal,
                igv: dto.igv,
                total_monto: dto.total_monto,
                moneda: dto.moneda,
                observaciones: dto.observaciones,
                metodos_pago: dto.pagos, // Guardamos el JSON de métodos de pago
                estado: 'Completado'
            }])
            .select("id")
            .single();

        if (errorVenta) throw new Error(errorVenta.message);

        // 2. Insertar Detalle de Productos
        const detalleProductos = dto.productos.map(p => ({
            venta_id: venta.id,
            producto_id: p.producto_id,
            cantidad: p.cantidad,
            precio_unitario: p.precio_unitario,
            subtotal: p.subtotal
        }));

        const { error: errorDetalle } = await supabase
            .from("venta_productos")
            .insert(detalleProductos);

        if (errorDetalle) throw new Error(errorDetalle.message);

        return venta.id;
    }


    // Obtener una venta específica por ID con sus productos detallados
    static async getById(id: number) {
        const { data, error } = await supabase
            .from("ventas")
            .select(`
            *,
            cliente:clientes (*),
            venta_productos (
                *,
                producto:productos (nombre_producto, categoria)
            ),
            documentos_ajuste (
                id,
                tipo,
                serie_correlativo,
                motivo,
                monto_ajuste,
                fecha_emision,
                documento_ajuste_detalles (
                    producto_id,
                    cantidad
                )
            )
        `)
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);

        // ===============================
        // CALCULO DE AJUSTES
        // ===============================
        const devolucionesPrevias: Record<number, number> = {};
        let totalNotasCredito = 0;
        let totalNotasDebito = 0;

        data.documentos_ajuste?.forEach((doc: any) => {
            if (doc.tipo === 'Nota de Crédito') {
                totalNotasCredito += Number(doc.monto_ajuste || 0);

                doc.documento_ajuste_detalles?.forEach((det: any) => {
                    devolucionesPrevias[det.producto_id] =
                        (devolucionesPrevias[det.producto_id] || 0) + det.cantidad;
                });
            }

            if (doc.tipo === 'Nota de Débito') {
                totalNotasDebito += Number(doc.monto_ajuste || 0);
            }
        });

        const productosConDisponibilidad = data.venta_productos.map((vp: any) => {
            const yaDevuelto = devolucionesPrevias[vp.producto_id] || 0;

            return {
                ...vp,
                cantidadOriginal: vp.cantidad,
                cantidadYaDevuelta: yaDevuelto,
                cantidadDisponible: Math.max(0, vp.cantidad - yaDevuelto)
            };
        });

        const totalOriginal = Number(data.total_monto);
        const totalAjustado = totalOriginal - totalNotasCredito + totalNotasDebito;

        const notasCredito = data.documentos_ajuste
            ?.filter((d: any) => d.tipo === 'Nota de Crédito')
            .map((d: any) => ({
                id: d.id,
                serie_correlativo: d.serie_correlativo,
                motivo: d.motivo,
                monto: Number(d.monto_ajuste),
                fecha_emision: d.fecha_emision,
                detalles: d.documento_ajuste_detalles || []
            })) ?? [];

        const notasDebito = data.documentos_ajuste
            ?.filter((d: any) => d.tipo === 'Nota de Débito')
            .map((d: any) => ({
                id: d.id,
                serie_correlativo: d.serie_correlativo,
                motivo: d.motivo,
                monto: Number(d.monto_ajuste),
                fecha_emision: d.fecha_emision
            })) ?? [];


        const result = {
            ...data,
            venta_productos: productosConDisponibilidad,
            totalOriginal,
            totalNotasCredito,
            totalNotasDebito,
            totalAjustado,

            // 🔥 LO QUE FALTABA
            notasCredito,
            notasDebito
        };

        console.log("Resultado getById:", result);

        return result;



    }


}