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
        moneda_origen_id: number;
        moneda_destino_id: number;
        fecha: string;
        compra: number;
        venta: number;
    }) {
        if (data.moneda_origen_id === data.moneda_destino_id) {
            throw new Error("La moneda origen y destino no pueden ser iguales.");
        }

        if (data.compra <= 0 || data.venta <= 0) {
            throw new Error("Compra y venta deben ser mayores a 0.");
        }

        return await TipoCambioRepository.create(data);
    }

    async listarTiposCambio() {
        return await TipoCambioRepository.getAll();
    }

}


export const TipoCambioService = new TipoCambioServiceClass();
