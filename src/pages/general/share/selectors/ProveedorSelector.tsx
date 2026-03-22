"use client"

import { useEffect, useState } from "react"
import { proveedoresService } from "@/services/general/shared/proveedores.service"
import { SearchableSelect } from "@/pages/general/share/SearchableSelect" // El componente de arriba
import { Label } from "@/components/ui/label"

interface Props {
    proveedorSeleccionado: number | null
    onSeleccionar: (id: number) => void
}

export function ProveedorSelector({
    proveedorSeleccionado,
    onSeleccionar
}: Props) {
    const [proveedores, setProveedores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargar = async () => {
            try {
                const data = await proveedoresService.obtenerTodos()
                setProveedores(data || [])
            } finally {
                setLoading(false)
            }
        }
        cargar()
    }, [])

    // Mapeamos los datos al formato que pide el componente reutilizable
    const options = proveedores.map((p) => ({
        value: p.id,
        label: p.nombre
    }))

    return (
        <div className="flex flex-col space-y-2 w-full">
            <Label className="text-sm font-semibold">Proveedor</Label>
            <SearchableSelect
                options={options}
                value={proveedorSeleccionado}
                onChange={(id) => onSeleccionar(Number(id))}
                placeholder={loading ? "Cargando proveedores..." : "Seleccionar proveedor"}
                emptyMessage="Proveedor no encontrado."
            />
        </div>
    )
}