import { VentasRepository } from "@/repository/ventas/ventas.repository";
import { VentasInventarioRepository } from "@/repository/ventas/ventas.inventario.repository";

class VentasServiceClass {
    // Obtener el listado histórico de ventas
    async getAll() {
        return await VentasRepository.getAll();
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
            VentasInventarioRepository.descontarStock(p.producto_id, p.cantidad)
        );
        await Promise.all(promesasDescuento);

        return ventaId;
    }

    async getVentaById(id: number) {
        return await VentasRepository.getById(id);
    }
}

export const VentasService = new VentasServiceClass();