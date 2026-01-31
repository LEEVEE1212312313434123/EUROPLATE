// @/services/national/compra-nacional.service.ts
import { CompraNacionalRepository } from "@/repository/national/compra-nacional.repository";

export class CompraNacionalService {
    /* ===============================
       🆕 CREAR COMPRA
    =============================== */
    static async crearCompra(payload: any) {
        if (!payload.proveedor_id) throw new Error("Debe seleccionar un proveedor");
        if (!payload.tipo_comprobante)
            throw new Error("Tipo de comprobante requerido");
        if (!payload.items || payload.items.length === 0)
            throw new Error("Debe agregar al menos un ítem");

        payload.subtotal = Number(payload.subtotal) || 0;
        payload.igv = Number(payload.igv) || 0;
        payload.total_monto = Number(payload.total_monto) || 0;

        return CompraNacionalRepository.crear(payload);
    }

    /* ===============================
       🔍 OBTENER
    =============================== */
    static async obtenerPorId(id: number) {
        if (!id) throw new Error("ID inválido");
        return CompraNacionalRepository.obtenerPorId(id);
    }

    static async listarCompras() {
        return CompraNacionalRepository.listar();
    }

    /* ===============================
       💰 MARCAR COMO PAGADA
    =============================== */
    static async pagarCompra(compraId: number) {
        if (!compraId) throw new Error("Compra inválida");

        return CompraNacionalRepository.cambiarEstado(
            compraId,
            "Pagado"
        );
    }

    /* ===============================
       📦 MARCAR COMO ENTREGADA (STOCK)
    =============================== */
    static async entregarCompra(compraId: number) {
        if (!compraId) throw new Error("Compra inválida");

        return CompraNacionalRepository.cambiarEstado(
            compraId,
            "Entregado"
        );
    }

    /* ===============================
       ❌ ANULAR
    =============================== */
    static async anularCompra(compraId: number, motivo: string) {
        if (!compraId) throw new Error("Compra inválida");

        return CompraNacionalRepository.cambiarEstado(
            compraId,
            "Anulado",
            motivo
        );
    }
}
