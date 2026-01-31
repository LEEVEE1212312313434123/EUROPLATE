// @/services/ventas/notas_debito.service.ts
import { DocumentosAjusteRepository } from "@/repository/ventas/documentos_ajuste.repository";

export class NotasDebitoService {
    static async getNotasDebito() {
        const data = await DocumentosAjusteRepository.getAllByType('Nota de Débito');

        return data.map(nota => ({
            id: nota.id,
            tipo: "Nota de Débito", // <--- ESTO ES VITAL PARA EL MODAL
            serie_correlativo: nota.serie_correlativo,
            motivo: nota.motivo,
            monto: nota.monto_ajuste,
            fecha_emision: nota.fecha_emision,
            moneda: nota.ventas?.moneda || 'USD',
            venta_id: nota.venta_id,
            cliente_nombre: nota.ventas?.cliente?.nombre || 'Consumidor Final',
            detalles: nota.documento_ajuste_detalles || []
        }));
    }

    static async eliminarNota(id: number) {
        return await DocumentosAjusteRepository.delete(id);
    }
}