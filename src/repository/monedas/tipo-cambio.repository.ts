import { supabase } from "@/lib/supabaseClient";
import type { TipoCambioEntity } from "@/types/moneda/entity/tipo-cambio.entity";

export class TipoCambioRepository {
    static async getByFecha(
        monedaOrigenId: number,
        monedaDestinoId: number,
        fecha: string
    ): Promise<TipoCambioEntity | null> {
        const { data, error } = await supabase
            .from("tipo_cambio")
            .select("*")
            .eq("moneda_origen_id", monedaOrigenId)
            .eq("moneda_destino_id", monedaDestinoId)
            .eq("fecha", fecha)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    static async create(
        tipoCambio: Omit<TipoCambioEntity, "id" | "created_at">
    ): Promise<TipoCambioEntity> {
        const { data, error } = await supabase
            .from("tipo_cambio")
            .insert([tipoCambio])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    static async update(
        id: number,
        cambios: Partial<TipoCambioEntity>
    ): Promise<void> {
        const { error } = await supabase
            .from("tipo_cambio")
            .update(cambios)
            .eq("id", id);

        if (error) throw new Error(error.message);
    }
}
