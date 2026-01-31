import { VentasRepository } from "@/repository/ventas/ventas.repository";
import { VentasInventarioRepository } from "@/repository/ventas/ventas.inventario.repository";
import { AjustesService } from "@/services/ventas/ajustes.service";
class VentasServiceClass {
    // Obtener el listado histórico de ventas
    async getAll() {
        return await VentasRepository.getAll();
    }

    // @/services/ventas/venta.service.ts
    async getVentasParaTabla() {
        // Obtenemos las ventas
        const ventas = await VentasRepository.getAll();

        // Obtenemos los ajustes para identificar cuáles tienen notas
        // Nota: En una app de alto tráfico, lo ideal sería hacer un JOIN en el repo, 
        // pero para este flujo, mapear los ajustes es más sencillo.

        return Promise.all(ventas.map(async (v) => {
            const ajustes = await AjustesService.obtenerAjustesPorVenta(v.id);

            return {
                id: v.id,
                cliente: v.cliente?.nombre || "Consumidor Final",
                total: `${v.moneda} ${Number(v.total_monto).toFixed(2)}`,
                tipoPago: Array.isArray(v.metodos_pago)
                    ? v.metodos_pago.map((p: any) => p.metodo).join(", ")
                    : "Efectivo",
                estado: v.estado || "Completado",
                fecha: v.fecha_venta
                    ? new Date(v.fecha_venta).toLocaleDateString()
                    : "Sin fecha",
                // Flags para la UI
                conteoNotasCredito: ajustes.filter((a: any) => a.tipo === 'Nota de Crédito').length,
                conteoNotasDebito: ajustes.filter((a: any) => a.tipo === 'Nota de Débito').length
            };
        }));
    }

    async eliminarVenta(id: number) {
        return await VentasRepository.delete(id);
    }

    // Registrar una nueva venta con validación de stock inmediata
    async registrarVenta(datosVenta: any, productos: any[]) {
        // 1. Validar stock antes de proceder para cada producto
        for (const p of productos) {
            const stockDisponible = await VentasInventarioRepository.validarStockDisponible(p.producto_id, p.cantidad);
            if (!stockDisponible) {
                throw new Error(`Stock insuficiente para el producto ID: ${p.producto_id}`);
            }
        }

        // 2. Registrar la venta en la base de datos
        const ventaId = await VentasRepository.registrarVenta(datosVenta);

        // 3. Descontar el stock de los productos vendidos
        const promesasDescuento = productos.map(p =>
            VentasInventarioRepository.descontarStockFIFO(p.producto_id, p.cantidad)
        );
        await Promise.all(promesasDescuento);

        return ventaId;
    }

    async getVentaById(id: number) {
        return await VentasRepository.getById(id);
    }
}

export const VentasService = new VentasServiceClass();