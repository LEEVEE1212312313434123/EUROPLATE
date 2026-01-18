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
        cliente:clientes (*), -- Trae los datos del cliente unido por la FK
        venta_productos (
          *,
          producto:productos (nombre_producto, categoria)
        )
      `)
            .eq("id", id)
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
}