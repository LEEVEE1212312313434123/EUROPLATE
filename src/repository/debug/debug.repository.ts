import { supabase } from "@/lib/supabaseClient";

export class DebugRepository {
    /**
     * Obtiene todos los datos de las tablas principales y los imprime con formato
     */
    static async inspeccionarBaseDeDatos() {
        console.group("🔍 INSPECCIÓN TOTAL DE BASE DE DATOS");

        const tablas = [
            "almacenes",
            "clientes",
            "comprobante_series",
            "documento_ajuste_detalles",
            "documentos_ajuste",
            "estado_importaciones",
            "importacion_adjuntos",
            "importacion_productos",
            "importaciones",
            "materiales",
            "precios",
            "productos",
            "venta_productos",
            "ventas",
        ];

        const resultadoFinal = {};
        try {
            // Ejecutamos todas las consultas al mismo tiempo
            const resultados = await Promise.all(
                tablas.map(tabla => supabase.from(tabla).select("*"))
            );

            tablas.forEach((nombreTabla, index) => {
                const { data, error } = resultados[index];

                if (error) {
                    resultadoFinal[nombreTabla] = {
                        error: error.message,
                        data: []
                    };
                } else {
                    resultadoFinal[nombreTabla] = {
                        error: null,
                        data: data || []
                    };
                }
            });

        } catch (err) {
            console.error("Error crítico durante la inspección:", err);
            return { error: "Error crítico durante la inspección", details: err };
        }
        console.log(resultadoFinal);
        return resultadoFinal;


    }
}