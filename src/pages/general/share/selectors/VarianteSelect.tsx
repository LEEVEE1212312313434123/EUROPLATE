"use client"

import { useEffect, useState } from "react"

import { SearchableSelect } from "@/pages/general/share/SearchableSelect"

import { productoVariantesService } from "@/services/general/productoVariantes.service"

interface Props {
    varianteSeleccionada: number | null
    onSeleccionar: (id: number) => void
    tipo?: string
}

export function VarianteSelector({
    varianteSeleccionada,
    onSeleccionar,
    tipo = "producto"
}: Props) {

    const [variantes, setVariantes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        const cargar = async () => {

            try {

                const data =
                    await productoVariantesService.obtenerVariantesPorTipo(tipo)

                setVariantes(data || [])

            } finally {

                setLoading(false)

            }

        }

        cargar()

    }, [tipo])

    const options = variantes.map((v) => ({

        value: v.id,

        label: [v.producto_nombre, v.sku]
            .filter(Boolean)
            .join(" - ")

    }))

    return (

        <div className="flex flex-col space-y-2 w-full">

            <SearchableSelect
                options={options}
                value={varianteSeleccionada}
                onChange={(id) => onSeleccionar(Number(id))}
                placeholder={
                    loading
                        ? "Cargando variantes..."
                        : "Buscar producto o SKU"
                }
                emptyMessage="Variante no encontrada."
            />

        </div>

    )

}