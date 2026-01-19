import { supabase } from "@/lib/supabaseClient";

export class VentasInventarioRepository {
    /**
     * Actualiza el stock en la tabla 'almacenes' restando la cantidad vendida.
     * Se recomienda llamar a esto después de registrarVenta.
     */
    static async descontarStockFIFO(productoId: number, cantidadVendida: number) {
        const { data, error } = await supabase
            .from("importacion_productos")
            .select("id, cantidad")
            .eq("producto_id", productoId)
            .order("id", { ascending: true });

        if (error) throw error;
        if (!data || data.length === 0) throw new Error("Producto sin stock");

        let restante = cantidadVendida;

        for (const item of data) {
            if (restante <= 0) break;

            const descontar = Math.min(item.cantidad, restante);
            const nuevoStock = item.cantidad - descontar;

            if (nuevoStock <= 0) {
            // Si queda en 0 o menos, eliminar el registro
            await supabase
                .from("importacion_productos")
                .delete()
                .eq("id", item.id);
            } else {
            // Si aún queda stock, actualizar
            await supabase
                .from("importacion_productos")
                .update({ cantidad: nuevoStock })
                .eq("id", item.id);
            }

            restante -= descontar;
        }

        if (restante > 0) {
            throw new Error("Stock insuficiente para completar la venta");
        }
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
        categoria,
        precios (precio_max, moneda),
        importacion_productos (cantidad)
        `)
        .eq("activo", true);

    if (error) throw new Error(error.message);

    return data.map(p => {
        const stockTotal = p.importacion_productos?.reduce(
        (acc, item) => acc + Number(item.cantidad || 0),
        0
        ) ?? 0;

        return {
        id: p.id,
        nombre: p.nombre_producto,
        categoria: p.categoria,
        precio: p.precios?.[0]?.precio_max ?? 0,
        moneda: p.precios?.[0]?.moneda ?? "USD",
        stock: stockTotal
        };
    });
    }

    // Añadir a VentasInventarioRepository en @/repository/ventas/ventas.inventario.repository
    static async validarStockDisponible(productoId: number, cantidadRequerida: number): Promise<boolean> {
        const { data, error } = await supabase
            .from("importacion_productos")
            .select("cantidad")
            .eq("producto_id", productoId);

        if (error) {
            console.error("Error validando stock:", error);
            return false;
        }

        const stockTotal = data.reduce(
            (acc, item) => acc + Number(item.cantidad || 0),
            0
        );

        return stockTotal >= cantidadRequerida;
        }
}