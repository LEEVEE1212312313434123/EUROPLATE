import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

import type { CompraNacionalRow } from "@/components/common/Logistica/ComprasNacionalesTable";

export function useComprasNacionales() {
    const [data, setData] = useState<CompraNacionalRow[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCompras = async () => {
            setIsLoading(true);
            setError(null);

            try {
                // 1️⃣ Traemos todas las compras nacionales
                const { data: comprasData, error: comprasError } = await supabase
                    .from("compras_nacionales")
                    .select(`
                        id,
                        proveedor_id,
                        serie,
                        correlativo,
                        total,
                        estado,
                        fecha_emision
                    `)
                    .order("id", { ascending: false });

                if (comprasError) throw comprasError;

                // 2️⃣ Traemos todos los proveedores
                const { data: proveedoresData, error: proveedoresError } = await supabase
                    .from("proveedores")
                    .select(`id, razon_social`);

                if (proveedoresError) throw proveedoresError;

                // 3️⃣ Mapear compras con nombre de proveedor
                const mapped: CompraNacionalRow[] = (comprasData ?? []).map((c: any) => {
                    const proveedor = proveedoresData?.find((p: any) => p.id === c.proveedor_id);
                    return {
                        id: c.id,
                        proveedor: proveedor?.razon_social ?? "N/A",
                        serie: c.serie,
                        correlativo: c.correlativo,
                        total: Number(c.total),
                        estado: c.estado,
                        fecha_emision: c.fecha_emision,
                    };
                });

                setData(mapped);
            } catch (err: any) {
                console.error("useComprasNacionales error:", err);
                setError(err.message ?? "Error al cargar compras nacionales");
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCompras();
    }, []);

    return {
        data,
        isLoading,
        error,
    };
}
