import { TipoCambioRepository } from "@/repository/monedas/tipo-cambio.repository";
import { MonedaRepository } from "@/repository/monedas/moneda.repository";

class TipoCambioServiceClass {
    async obtenerTipoCambioDelDia(
        codigoOrigen: string,
        codigoDestino: string,
        fecha?: string
    ) {
        const fechaConsulta =
            fecha ?? new Date().toISOString().split("T")[0];

        const monedaOrigen = await MonedaRepository.getByCodigo(codigoOrigen);
        const monedaDestino = await MonedaRepository.getByCodigo(codigoDestino);

        if (!monedaOrigen || !monedaDestino) {
            throw new Error("Moneda no encontrada");
        }

        const tipoCambio = await TipoCambioRepository.getByFecha(
            monedaOrigen.id,
            monedaDestino.id,
            fechaConsulta
        );

        if (!tipoCambio) {
            throw new Error(
                `No existe tipo de cambio registrado para ${fechaConsulta}`
            );
        }

        return tipoCambio;
    }

    async registrarTipoCambio(data: {
        codigoOrigen: string;
        codigoDestino: string;
        fecha: string;
        compra: number;
        venta: number;
    }) {
        const monedaOrigen = await MonedaRepository.getByCodigo(data.codigoOrigen);
        const monedaDestino = await MonedaRepository.getByCodigo(data.codigoDestino);

        if (!monedaOrigen || !monedaDestino) {
            throw new Error("Moneda inválida");
        }

        const existente = await TipoCambioRepository.getByFecha(
            monedaOrigen.id,
            monedaDestino.id,
            data.fecha
        );

        if (existente) {
            throw new Error("Ya existe tipo de cambio para esa fecha");
        }

        return await TipoCambioRepository.create({
            moneda_origen_id: monedaOrigen.id,
            moneda_destino_id: monedaDestino.id,
            fecha: data.fecha,
            compra: data.compra,
            venta: data.venta,
        });
    }
}

export const TipoCambioService = new TipoCambioServiceClass();
