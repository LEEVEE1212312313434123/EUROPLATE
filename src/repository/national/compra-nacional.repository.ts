// @/repository/national/compra-nacional.repository.ts
import { supabase } from "@/lib/supabase/client";
import { SeriesRepository } from "@/repository/ventas/series.repository";

export class CompraNacionalRepository {
    static async crear(payload: any) {
        /* ===============================
           1️⃣ CORRELATIVO
        =============================== */
        const serieInfo = await SeriesRepository.obtenerSiguienteNumero(
            payload.tipo_comprobante
        );

        const correlativoNumerico = Number(serieInfo.correlativo);

        /* ===============================
           2️⃣ CABECERA
        =============================== */
        const { data: compra, error: compraError } = await supabase
            .from("compras_nacionales")
            .insert({
                proveedor_id: payload.proveedor_id,
                tipo_comprobante: payload.tipo_comprobante,
                serie: serieInfo.serie,
                correlativo: correlativoNumerico,

                fecha_emision: new Date(),
                fecha_vencimiento: payload.fecha_vencimiento ?? null,

                subtotal: payload.subtotal,
                igv: payload.igv,
                total: payload.total_monto,

                moneda: payload.moneda,
                observaciones: payload.observaciones ?? "",

                estado: "Registrado",
            })
            .select()
            .single();

        if (compraError) throw compraError;

        /* ===============================
           3️⃣ DETALLE
        =============================== */
        if (payload.items?.length > 0) {
            const detalles = payload.items.map((item: any) => ({
                compra_nacional_id: compra.id,
                producto_id: item.producto_id,
                descripcion: item.descripcion ?? null,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                subtotal: item.subtotal,
            }));

            const { error: detalleError } = await supabase
                .from("compra_nacional_productos")
                .insert(detalles);

            if (detalleError) throw detalleError;
        }

        /* ===============================
           4️⃣ ADJUNTOS
        =============================== */
        if (payload.adjuntos?.length > 0) {
            const adjuntos = payload.adjuntos.map((a: any) => ({
                compra_nacional_id: compra.id,
                url: a.url,
                nombre_archivo: a.nombre_archivo,
            }));

            const { error: adjuntoError } = await supabase
                .from("compra_nacional_adjuntos")
                .insert(adjuntos);

            if (adjuntoError) throw adjuntoError;
        }

        /* ===============================
           5️⃣ ESTADO INICIAL (HISTÓRICO)
        =============================== */
        const { error: estadoError } = await supabase
            .from("estado_compras_nacionales")
            .insert({
                compra_nacional_id: compra.id,
                estado: "Registrado",
                motivo: null,
            });

        if (estadoError) throw estadoError;

        return compra;
    }

    /* ===============================
       🔍 OBTENER POR ID
    =============================== */
    static async obtenerPorId(id: number) {
        return await supabase
            .from("compras_nacionales")
            .select(`
        *,
        proveedor:clientes(*),
        productos:compra_nacional_productos(*, producto:productos(*)),
        adjuntos:compra_nacional_adjuntos(*),
        estados:estado_compras_nacionales(*)
      `)
            .eq("id", id)
            .single();
    }

    /* ===============================
       📋 LISTADO
    =============================== */
    static async listar() {
        return await supabase
            .from("compras_nacionales")
            .select(`
        *,
        proveedor:clientes(nombre),
        estado_compras_nacionales(estado, fecha_registro)
      `)
            .order("created_at", { ascending: false });
    }

    /* ===============================
       🔄 CAMBIAR ESTADO
    =============================== */
    static async cambiarEstado(
        compraId: number,
        nuevoEstado: string,
        motivo?: string
    ) {
        const { data: compra } = await supabase
            .from("compras_nacionales")
            .select("estado")
            .eq("id", compraId)
            .single();

        if (!compra) throw new Error("Compra no encontrada");

        if (compra.estado === nuevoEstado) {
            throw new Error(`La compra ya está en estado ${nuevoEstado}`);
        }

        if (compra.estado === "Anulado") {
            throw new Error("No se puede modificar una compra anulada");
        }

        // actualizar estado principal
        await supabase
            .from("compras_nacionales")
            .update({ estado: nuevoEstado })
            .eq("id", compraId);

        // histórico
        await supabase
            .from("estado_compras_nacionales")
            .insert({
                compra_nacional_id: compraId,
                estado: nuevoEstado,
                motivo: motivo ?? null,
            });

        // 📦 IMPACTO STOCK SOLO AL ENTREGAR
        if (nuevoEstado === "Entregado") {
            await this.impactarStock(compraId);
        }
    }

    /* ===============================
       📦 IMPACTO STOCK
    =============================== */
    static async impactarStock(compraId: number) {
        const { data: productos, error } = await supabase
            .from("compra_nacional_productos")
            .select("producto_id, cantidad")
            .eq("compra_nacional_id", compraId)
            .not("producto_id", "is", null);

        if (error) throw error;
        if (!productos || productos.length === 0) return;

        for (const item of productos) {
            const { data: almacen } = await supabase
                .from("almacenes")
                .select("id, stock_actual")
                .eq("producto_id", item.producto_id)
                .single();

            if (almacen) {
                await supabase
                    .from("almacenes")
                    .update({
                        stock_actual: (almacen.stock_actual || 0) + item.cantidad,
                    })
                    .eq("id", almacen.id);
            } else {
                await supabase.from("almacenes").insert({
                    producto_id: item.producto_id,
                    stock_actual: item.cantidad,
                    stock_minimo: 0,
                    ubicacion: "ALMACÉN PRINCIPAL",
                });
            }
        }
    }
}
