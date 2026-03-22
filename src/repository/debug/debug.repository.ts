// @/repository/debug/debug.repository.ts
import { supabase } from "@/lib/supabaseClient";

export class DebugRepository {
    /**
     * Obtiene todos los datos de TODAS las tablas de la base de datos
     */
    static async inspeccionarBaseDeDatos() {
        const tablas = [
            "almacenes",
            "clientes",
            "compra_nacional_adjuntos",
            "compra_nacional_productos",
            "compras_nacionales",
            "comprobante_series",
            "documento_ajuste_detalles",
            "documentos_ajuste",
            "estado_compras_nacionales",
            "estado_importaciones",
            "importacion_adjuntos",
            "importacion_productos",
            "importaciones",
            "materiales",
            "monedas",
            "precios",
            "productos",
            "proveedores",
            "sucursales",
            "tipo_cambio",
            "venta_productos",
            "ventas"
        ];

        const resultadoFinal: Record<string, { data: any[]; error: string | null; count: number }> = {};

        try {
            const resultados = await Promise.all(
                tablas.map(tabla => supabase.from(tabla).select("*"))
            );

            tablas.forEach((nombreTabla, index) => {
                const { data, error } = resultados[index];
                resultadoFinal[nombreTabla] = {
                    error: error ? error.message : null,
                    data: data || [],
                    count: data ? data.length : 0
                };
            });

            console.group("🔍 INSPECCIÓN TOTAL DE BASE DE DATOS");
            console.log(resultadoFinal);
            console.groupEnd();

            return resultadoFinal;
        } catch (err: any) {
            console.error("Error crítico durante la inspección:", err);
            throw err;
        }
    }
}