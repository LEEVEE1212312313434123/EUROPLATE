import { MonedaRepository } from "@/repository/monedas/moneda.repository";

class MonedaServiceClass {
    async listarMonedas() {
        return await MonedaRepository.getAll();
    }

    async obtenerPorCodigo(codigo: string) {
        return await MonedaRepository.getByCodigo(codigo);
    }

    async registrarMoneda(data: {
        codigo: string;
        nombre: string;
        simbolo?: string;
    }) {
        return await MonedaRepository.create(data);
    }

}

export const MonedaService = new MonedaServiceClass();
