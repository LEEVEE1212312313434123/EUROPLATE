// @/repository/ventas/documentos_ajuste.repository.ts
import { supabase } from "@/lib/supabaseClient";

export class DocumentosAjusteRepository {
    static async registrarDocumento(datos: any) {
        // 1. Insertar cabecera de la nota
        const { data, error } = await supabase
            .from("documentos_ajuste")
            .insert([{
                venta_id: datos.venta_id,
                tipo: datos.tipo, // 'Nota de Crédito' o 'Nota de Débito'
                serie_correlativo: datos.serie,
                motivo: datos.motivo,
                monto_ajuste: datos.monto_ajuste
            }])
            .select("id")
            .single();

        if (error) throw new Error(error.message);

        // 2. Si hay detalle de productos (devoluciones), insertarlos
        if (datos.productos && datos.productos.length > 0) {
            const detalles = datos.productos.map((p: any) => ({
                documento_ajuste_id: data.id,
                producto_id: p.producto_id,
                cantidad: p.cantidad,
                precio_unitario: p.precio_unitario
            }));

            const { error: errorDetalle } = await supabase
                .from("documento_ajuste_detalles")
                .insert(detalles);

            if (errorDetalle) throw new Error(errorDetalle.message);
        }

        return data.id;
    }

    static async getByVentaId(ventaId: number) {
        const { data, error } = await supabase
            .from("documentos_ajuste")
            .select(`*, documento_ajuste_detalles(*)`)
            .eq("venta_id", ventaId);

        if (error) throw error;
        return data;
    }


    // Obtener todos los documentos por tipo (Nota de Crédito / Nota de Débito)
    static async getAllByType(tipo: 'Nota de Crédito' | 'Nota de Débito') {
        const { data, error } = await supabase
            .from("documentos_ajuste")
            .select(`
            *,
            documento_ajuste_detalles (*), 
            ventas (
                moneda,
                cliente:clientes (nombre)
            )
        `)
            .eq("tipo", tipo)
            .order("fecha_emision", { ascending: false });

        if (error) throw error;
        return data;
    }

    static async delete(id: number) {
        const { error } = await supabase
            .from("documentos_ajuste")
            .delete()
            .eq("id", id);
        if (error) throw error;
    }
}