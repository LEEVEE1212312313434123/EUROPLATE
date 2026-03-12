"use client"

import { useEffect, useState } from "react"
import { EditableCombobox } from "@/pages/general/share/EditableCombobox"
import { productoVariantesService } from "@/services/general/productoVariantes.service"

type Producto = {
    id: number
    nombre: string
}

type Props = {
    productoSeleccionado: number | null
    onSeleccionar: (productoId: number) => void
}

const TIPOS_PRODUCTO = [
    { value: "mercaderia", label: "Mercadería" },
    { value: "producto_terminado", label: "Producto terminado" },
    { value: "insumo", label: "Insumo" },
]

export function ProductoSelector({
    productoSeleccionado,
    onSeleccionar
}: Props) {
    const [tipoId, setTipoId] = useState<string>("") // Guarda el 'value' interno (ej: 'mercaderia')
    const [productos, setProductos] = useState<Producto[]>([])

    // Cargar productos cuando cambia el tipo
    useEffect(() => {
        if (!tipoId) {
            setProductos([])
            return
        }

        const cargarProductos = async () => {
            try {
                const data = await productoVariantesService.obtenerPorTipo(tipoId)
                setProductos(data || [])
            } catch (error) {
                console.error("Error al cargar productos:", error)
            }
        }

        cargarProductos()
    }, [tipoId])

    return (
        <div className="grid grid-cols-[30%_30%_1fr] gap-4 items-end w-full">

            {/* SELECT TIPO */}
            <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold">
                    Tipo de producto
                </label>
                <EditableCombobox
                    options={TIPOS_PRODUCTO.map(t => ({
                        value: t.label, // Mostramos el texto amigable
                        label: t.label
                    }))}
                    // Buscamos el label correspondiente al value guardado
                    value={TIPOS_PRODUCTO.find(t => t.value === tipoId)?.label || ""}
                    onChange={(labelSeleccionado) => {
                        const tipoObj = TIPOS_PRODUCTO.find(t => t.label === labelSeleccionado)
                        if (tipoObj) {
                            setTipoId(tipoObj.value)
                            onSeleccionar(0) // Resetear producto al cambiar categoría
                        }
                    }}
                    placeholder="Seleccionar tipo"
                />
            </div>

            {/* SELECT PRODUCTO */}
            <div className="flex flex-col space-y-2">
                {tipoId && (
                    <>
                        <label className="text-sm font-semibold">
                            Producto
                        </label>
                        <EditableCombobox
                            options={productos.map(p => ({
                                value: p.nombre, // Solo texto para la búsqueda y visualización
                                label: p.nombre
                            }))}
                            // Buscamos el nombre correspondiente al ID seleccionado
                            value={productos.find(p => p.id === productoSeleccionado)?.nombre || ""}
                            onChange={(nombreSeleccionado) => {
                                const producto = productos.find(p => p.nombre === nombreSeleccionado)
                                if (producto) {
                                    onSeleccionar(producto.id) // Enviamos el ID al padre
                                }
                            }}
                            placeholder="Buscar producto..."
                        />
                    </>
                )}
            </div>

            {/* Columna vacía para completar el layout */}
            <div />
        </div>
    )
}