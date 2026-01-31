// @/services/ventas/notas_credito.service.ts
import { DocumentosAjusteRepository } from "@/repository/ventas/documentos_ajuste.repository";

export class NotasCreditoService {
    static async getNotasCredito() {
        const data = await DocumentosAjusteRepository.getAllByType('Nota de Crédito');

        return data.map(nota => ({
            id: nota.id,
            tipo: nota.tipo, // IMPORTANTE: Para el modal
            serie_correlativo: nota.serie_correlativo,
            motivo: nota.motivo,
            monto: nota.monto_ajuste,
            fecha_emision: nota.fecha_emision,
            moneda: nota.ventas?.moneda || 'USD',
            venta_id: nota.venta_id,
            cliente_nombre: nota.ventas?.cliente?.nombre || 'Desconocido',
            // Mapeamos los detalles para la tabla del modal
            detalles: nota.documento_ajuste_detalles || []
        }));
    }

    static async eliminarNota(id: number) {
        return await DocumentosAjusteRepository.delete(id);
    }
}