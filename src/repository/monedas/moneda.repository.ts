import { supabase } from "@/lib/supabaseClient";
import type { MonedaEntity } from "@/types/moneda/entity/moneda.entity";

export class MonedaRepository {
    static async getAll(): Promise<MonedaEntity[]> {
        const { data, error } = await supabase
            .from("monedas")
            .select("*")
            .order("codigo", { ascending: true });

        if (error) throw new Error(error.message);
        return data || [];
    }

    static async getByCodigo(codigo: string): Promise<MonedaEntity | null> {
        const { data, error } = await supabase
            .from("monedas")
            .select("*")
            .eq("codigo", codigo)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }

    static async create(
        moneda: Omit<MonedaEntity, "id" | "created_at">
    ): Promise<MonedaEntity> {
        const { data, error } = await supabase
            .from("monedas")
            .insert([moneda])
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }
}
