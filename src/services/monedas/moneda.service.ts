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
        simbolo: string;
    }) {
        const payload = {
            codigo: data.codigo,
            nombre: data.nombre,
            simbolo: data.simbolo || "", // valor por defecto si no viene
        };
        return await MonedaRepository.create(payload);
    }

}

export const MonedaService = new MonedaServiceClass();
