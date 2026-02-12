import { useEffect, useState } from "react";
import { TipoCambioService } from "@/services/monedas/tipo-cambio.service";

interface UseTipoCambioProps {
    codigoOrigen: string | null;
    codigoDestino: string | null;
    fecha?: string;
}

export function useTipoCambio({ codigoOrigen, codigoDestino, fecha }: UseTipoCambioProps) {
    const [tipoCambio, setTipoCambio] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function cargar() {
            if (!codigoOrigen || !codigoDestino) return;

            try {
                setLoading(true);
                setError(null);

                const data = await TipoCambioService.obtenerTipoCambioDelDia(
                    codigoOrigen,
                    codigoDestino,
                    fecha
                );

                // Usamos la venta para la conversión en ventas
                setTipoCambio(data.venta);
            } catch (err: any) {
                setError(err.message);
                setTipoCambio(null);
            } finally {
                setLoading(false);
            }
        }

        cargar();
    }, [codigoOrigen, codigoDestino, fecha]);

    const convertir = (monto: number) => {
        if (!tipoCambio) return 0;
        return monto * tipoCambio;
    };

    return { tipoCambio, convertir, loading, error };
}
