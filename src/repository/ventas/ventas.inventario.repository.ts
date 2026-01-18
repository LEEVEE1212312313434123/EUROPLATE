import { supabase } from "@/lib/supabaseClient";

export class VentasInventarioRepository {
    /**
     * Actualiza el stock en la tabla 'almacenes' restando la cantidad vendida.
     * Se recomienda llamar a esto después de registrarVenta.
     */
    static async descontarStock(productoId: number, cantidadVendida: number) {
        const { data: almacen, error: fetchError } = await supabase
            .from("almacenes")
            .select("stock_actual")
            .eq("producto_id", productoId)
            .maybeSingle(); // <--- Cambia .single() por .maybeSingle()

        if (fetchError || !almacen) {
            throw new Error(`Producto ${productoId} no encontrado en almacén`);
        }

        const nuevoStock = (almacen.stock_actual || 0) - cantidadVendida;

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
            .maybeSingle(); // <--- Cambia .single() por .maybeSingle()

        if (error) {
            console.error("Error validando stock:", error);
            return false;
        }

        // Si data es null, significa que el producto no tiene registro en almacén
        if (!data) return false;

        return data.stock_actual >= cantidadRequerida;
    }

}