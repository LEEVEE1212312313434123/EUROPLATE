// services/inventario.service.ts
import { supabase } from "@/lib/supabaseClient";
import type { Inventario } from "@/types/inventario.type";

export const InventarioService = {
    // =======================================================
    // Obtener todo el inventario completo
    // =======================================================
    async getAll(): Promise<Inventario[]> {
        const { data, error } = await supabase
            .from("inventario_completo")
            .select("*");

        if (error) throw new Error(error.message);
        return data || [];
    },

    // =======================================================
    // Filtrar inventario por producto
    // =======================================================
    async getByProducto(productoId: number): Promise<Inventario[]> {
        const { data, error } = await supabase
            .from("inventario_completo")
            .select("*")
            .eq("producto_id", productoId);

        if (error) throw new Error(error.message);
        return data || [];
    },

    // =======================================================
    // Filtrar inventario por importación (num_dua)
    // =======================================================
    async getByImportacion(num_dua: string): Promise<Inventario[]> {
        const { data, error } = await supabase
            .from("inventario_completo")
            .select("*")
            .eq("num_dua", num_dua);

        if (error) throw new Error(error.message);
        return data || [];
    },

    // =======================================================
    // Actualizar stock de almacén
    // =======================================================
    async actualizarStock(productoId: number, stock_actual: number): Promise<boolean> {
        const { error } = await supabase
            .from("almacenes")
            .update({ stock_actual })
            .eq("producto_id", productoId);

        if (error) throw new Error(error.message);
        return true;
    },
};
