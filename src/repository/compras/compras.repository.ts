// @/repository/compras/compras.repository.ts
import { supabase } from "@/lib/supabaseClient";

export class ComprasRepository {
    static async getAll() {
        const { data, error } = await supabase
            .from("importaciones")
            .select(`
        *,
        importacion_productos (
          id,
          cantidad,
          precio_unitario,
          producto_id
        )
      `)
            .order("fecha_llegada", { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }
}