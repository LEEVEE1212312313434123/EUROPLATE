import { supabase } from "@/lib/supabaseClient";

export class VentasInventarioRepository {
    /**
     * Actualiza el stock en la tabla 'almacenes' restando la cantidad vendida.
     * Se recomienda llamar a esto después de registrarVenta.
     */
    static async descontarStock(productoId: number, cantidadVendida: number) {
        // 1. Obtener stock actual
        const { data: almacen, error: fetchError } = await supabase
            .from("almacenes")
            .select("stock_actual")
            .eq("producto_id", productoId)
            .single();

        if (fetchError) throw new Error("Producto no encontrado en almacén");

        const nuevoStock = (almacen.stock_actual || 0) - cantidadVendida;

        if (nuevoStock < 0) {
            throw new Error("Stock insuficiente para realizar la venta");
        }

        // 2. Actualizar stock
        const { error: updateError } = await supabase
            .from("almacenes")
            .update({ stock_actual: nuevoStock })
            .eq("producto_id", productoId);

        if (updateError) throw new Error(updateError.message);
    }




    /**
     * Obtiene una lista de productos disponibles para la venta con sus precios y stock actual.
     */
    static async getProductosParaVenta() {
        const { data, error } = await supabase
            .from("productos")
            .select(`
        id,
        nombre_producto,
        precios (precio_max, moneda),
        almacenes (stock_actual, ubicacion)
      `)
            .eq("activo", true);

        if (error) throw new Error(error.message);

        return data.map(p => ({
            id: p.id,
            nombre: p.nombre_producto,
            precio: p.precios?.[0]?.precio_max ?? 0,
            moneda: p.precios?.[0]?.moneda ?? "USD",
            stock: p.almacenes?.[0]?.stock_actual ?? 0
        }));
    }

    // Añadir a VentasInventarioRepository en @/repository/ventas/ventas.inventario.repository
    static async validarStockDisponible(productoId: number, cantidadRequerida: number): Promise<boolean> {
        const { data, error } = await supabase
            .from("almacenes")
            .select("stock_actual")
            .eq("producto_id", productoId)
            .single();

        if (error || !data) return false;
        return data.stock_actual >= cantidadRequerida;
    }

}