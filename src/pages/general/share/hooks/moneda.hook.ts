// @/hooks/general/useMoneda.ts
import { useEffect, useState } from "react"
import { monedaService } from "@/services/general/moneda.service"

export function useMoneda() {
    const [tipoCambio, setTipoCambio] = useState<number | null>(null)
    const [monedas, setMonedas] = useState<any[]>([]) // Para los símbolos

    useEffect(() => {
        async function cargarTodo() {
            try {
                // Ejecutamos ambas promesas en paralelo para mayor velocidad
                const [dataCambio, dataMonedas] = await Promise.all([
                    monedaService.obtenerTipoCambioActual(),
                    monedaService.listarMonedas()
                ])

                setTipoCambio(dataCambio.tasa)
                setMonedas(dataMonedas)
            } catch (error) {
                console.error("Error cargando datos de moneda:", error)
            }
        }

        cargarTodo()
    }, [])

    return { tipoCambio, monedas }
}