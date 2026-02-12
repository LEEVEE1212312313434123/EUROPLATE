import { supabase } from "@/lib/supabaseClient";
import type { TipoCambioEntity } from "@/types/moneda/entity/tipo-cambio.entity";

export class TipoCambioRepository {

    static async getTipoCambioDelDia(
        monedaOrigenId: number,
        monedaDestinoId: number
    ) {
        const today = new Date().toISOString().split("T")[0];

        const { data, error } = await supabase
            .from("tipo_cambio")
            .select("*")
            .eq("moneda_origen_id", monedaOrigenId)
            .eq("moneda_destino_id", monedaDestinoId)
            .eq("fecha", today)
            .single();

        if (error) throw new Error("No existe tipo de cambio para hoy");

        return data;
    }

    static async getAll() {
        const { data, error } = await supabase
            .from("tipo_cambio")
            .select(`
                id,
                fecha,
                compra,
                venta,
                moneda_origen:moneda_origen_id (
                    id,
                    codigo,
                    simbolo
                ),
                moneda_destino:moneda_destino_id (
                    id,
                    codigo,
                    simbolo
                )
            `)
            .order("fecha", { ascending: false });

        if (error) throw new Error(error.message);
        return data || [];
    }


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


    static async create(data: {
        moneda_origen_id: number;
        moneda_destino_id: number;
        fecha: string;
        compra: number;
        venta: number;
    }) {
        const { error } = await supabase
            .from("tipo_cambio")
            .insert([data]);

        if (error) throw new Error(error.message);
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
