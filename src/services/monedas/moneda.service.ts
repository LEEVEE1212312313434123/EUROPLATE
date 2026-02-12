import { MonedaRepository } from "@/repository/monedas/moneda.repository";

class MonedaServiceClass {
    async listarMonedas() {
        return await MonedaRepository.getAll();
    }

    async obtenerPorCodigo(codigo: string) {
        return await MonedaRepository.getByCodigo(codigo);
    }
}

export const MonedaService = new MonedaServiceClass();
