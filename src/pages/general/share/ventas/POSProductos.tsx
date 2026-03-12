"use client"

import { useState } from "react"
import { Search } from "lucide-react" // Asumiendo que usas lucide-react, si no, puedes usar un emoji 🔍

interface Props {
    productos: any[]
    onAgregar: (producto: any) => void
}

export default function POSProductos({
    productos,
    onAgregar
}: Props) {
    // 1. Estado para el texto de búsqueda
    const [busqueda, setBusqueda] = useState("")

    // 2. Lógica de filtrado
    const productosFiltrados = productos.filter(p => {
        const query = busqueda.toLowerCase();
        return (
            p.producto_nombre?.toLowerCase().includes(query) ||
            p.sku?.toLowerCase().includes(query) ||
            p.precio_venta?.toString().includes(query)
        );
    });

    return (
        <div className="col-span-2 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold">Productos</h2>

                {/* 3. Input de Búsqueda */}
                <div className="relative w-64">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                        <Search size={18} />
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar nombre, SKU o precio..."
                        className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                </div>
            </div>

            {/* 4. Grid de Productos Filtrados */}
            <div className="grid grid-cols-3 gap-3 overflow-y-auto max-h-[70vh] p-1">
                {productosFiltrados.length > 0 ? (
                    productosFiltrados.map(p => (
                        <div
                            key={p.id}
                            className="border rounded-lg p-3 cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors shadow-sm bg-white"
                            onClick={() => onAgregar(p)}
                        >
                            <div className="font-semibold text-gray-800 line-clamp-1">
                                {p.producto_nombre}
                            </div>

                            <div className="text-xs text-gray-500 uppercase tracking-wider">
                                SKU: {p.sku}
                            </div>

                            <div className="text-blue-600 font-extrabold mt-2 text-lg">
                                S/ {p.precio_venta.toFixed(2)}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-3 text-center py-10 text-gray-400">
                        No se encontraron productos que coincidan.
                    </div>
                )}
            </div>
        </div>
    )
}