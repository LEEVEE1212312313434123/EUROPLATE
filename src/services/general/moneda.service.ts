import { tiposCambioRepository } from "@/repository/general/moneda.repository"


export const monedaService = {

    async obtenerTipoCambioActual() {

        const { data, error } =
            await tiposCambioRepository.getUltimoTipoCambio()

        if (error) throw new Error(error.message)

        return data
    },

    convertirUSDASoles(monto: number, tipoCambio: number) {
        return monto * tipoCambio
    },

    convertirSolesAUSD(monto: number, tipoCambio: number) {
        return monto / tipoCambio
    },

    async listarMonedas() {
        return await tiposCambioRepository.getMonedas();
    },

}