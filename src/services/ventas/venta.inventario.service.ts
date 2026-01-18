import { VentasInventarioRepository } from "@/repository/ventas/ventas.inventario.repository";

class VentasInventarioServiceClass {
    /**
     * Obtiene los productos filtrados solo por aquellos que 
     * tienen stock positivo y están marcados como activos.
     */
    async getCatalogoVenta() {
        const productos = await VentasInventarioRepository.getProductosParaVenta();
        return productos.filter(p => p.stock > 0);
    }

    /**
     * Verifica disponibilidad rápida para un producto específico
     */
    async verificarDisponibilidad(productoId: number, cantidad: number) {
        return await VentasInventarioRepository.validarStockDisponible(productoId, cantidad);
    }

    /**
     * Obtiene el resumen de precios (min/max) para el vendedor
     */
    async getPreciosVigentes() {
        return await VentasInventarioRepository.getProductosParaVenta();
    }
}

export const VentasInventarioService = new VentasInventarioServiceClass();