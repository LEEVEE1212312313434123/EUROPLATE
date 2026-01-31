// @/services/ventas/ajustes.service.ts
import { DocumentosAjusteRepository } from "@/repository/ventas/documentos_ajuste.repository";
import { VentasInventarioRepository } from "@/repository/ventas/ventas.inventario.repository";
import { SeriesRepository } from "@/repository/ventas/series.repository";

class AjustesServiceClass {


    async emitirNotaCredito(datos: {
        venta_id: number,
        motivo: string,
        monto_ajuste: number,
        productos: { producto_id: number, cantidad: number, precio_unitario: number }[]
    }) {
        const infoSerie = await SeriesRepository.obtenerSiguienteNumero('Nota de Crédito');

        const notaId = await DocumentosAjusteRepository.registrarDocumento({
            venta_id: datos.venta_id,
            tipo: 'Nota de Crédito',
            serie: infoSerie.completo,
            motivo: datos.motivo,
            monto_ajuste: datos.monto_ajuste,
            productos: datos.productos
        });

        if (datos.productos && datos.productos.length > 0) {
            const promesas = datos.productos.map(p =>
                VentasInventarioRepository.reingresarStock(p.producto_id, p.cantidad)
            );
            await Promise.all(promesas);
        }

        return {
            id: notaId,
            numero: infoSerie.completo
        };
    }

    async emitirNotaDebito(datos: {
        venta_id: number,
        motivo: string,
        monto_ajuste: number
    }) {
        const infoSerie = await SeriesRepository.obtenerSiguienteNumero('Nota de Débito');

        const notaId = await DocumentosAjusteRepository.registrarDocumento({
            ...datos,
            tipo: 'Nota de Débito',
            serie: infoSerie.completo
        });

        return {
            id: notaId,
            numero: infoSerie.completo
        };
    }

    async obtenerAjustesPorVenta(ventaId: number) {
        return await DocumentosAjusteRepository.getByVentaId(ventaId);
    }


}

export const AjustesService = new AjustesServiceClass();