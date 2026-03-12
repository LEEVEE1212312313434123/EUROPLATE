"use client"

import { useEffect, useState } from "react"

import { SearchableSelect } from "@/pages/general/share/SearchableSelect"

import { almacenesService } from "@/services/general/shared/almacenes.service"

interface Props {
    almacenSeleccionado: number | null
    onSeleccionar: (id: number) => void
}

export function AlmacenSelector({
    almacenSeleccionado,
    onSeleccionar
}: Props) {

    const [almacenes, setAlmacenes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const cargar = async () => {

            try {

                const data =
                    await almacenesService.obtenerTodos()

                setAlmacenes(data || [])

            } finally {

                setLoading(false)

            }

        }

        cargar()

    }, [])

    const options = almacenes.map((a) => ({

        value: a.id,

        label: [a.nombre, a.ubicacion]
            .filter(Boolean)
            .join(" - ")

    }))

    return (

        <div className="flex flex-col space-y-2 w-full">

            <SearchableSelect
                options={options}
                value={almacenSeleccionado}
                onChange={(id) => onSeleccionar(Number(id))}
                placeholder={
                    loading
                        ? "Cargando almacenes..."
                        : "Buscar almacén"
                }
                emptyMessage="Almacén no encontrado."
            />

        </div>

    )

}