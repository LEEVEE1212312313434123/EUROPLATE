// @/repository/ventas/series.repository.ts
import { supabase } from "@/lib/supabaseClient";

export class SeriesRepository {
    /**
     * Obtiene el siguiente número disponible y actualiza la base de datos
     */
    static async obtenerSiguienteNumero(tipo: string) {
        // 1. Obtener la serie configurada para ese tipo
        const { data: serieData, error: fetchError } = await supabase
            .from("comprobante_series")
            .select("id, serie, ultimo_numero")
            .eq("tipo_documento", tipo)
            .single();

        if (fetchError || !serieData) {
            throw new Error(`No se encontró configuración de serie para: ${tipo}`);
        }

        const nuevoNumero = serieData.ultimo_numero + 1;

        // 2. Actualizar el último número en la BD
        const { error: updateError } = await supabase
            .from("comprobante_series")
            .update({ ultimo_numero: nuevoNumero })
            .eq("id", serieData.id);

        if (updateError) throw updateError;

        // 3. Retornar formateado (Ej: NC01-00000046)
        const numeroFormateado = String(nuevoNumero).padStart(8, '0');
        return {
            serie: serieData.serie,
            correlativo: numeroFormateado,
            completo: `${serieData.serie}-${numeroFormateado}`
        };
    }

    // Helper rápido para SeriesRepository(Agrégalo a tu archivo series.repository.ts)

    static async obtenerInfoSerie(tipo: string) {
        return await supabase
            .from("comprobante_series")
            .select("serie, ultimo_numero")
            .eq("tipo_documento", tipo)
            .single();
    }

}