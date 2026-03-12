"use client"

import { useEffect, useState } from "react"

import { SearchableSelect } from "@/pages/general/share/SearchableSelect"

import { clienteService } from "@/services/general/shared/cliente.service"

interface Props {

    clienteSeleccionado: number | null

    onSeleccionar: (id: number | null) => void

}

export function ClienteSelector({
    clienteSeleccionado,
    onSeleccionar
}: Props) {

    const [clientes, setClientes] = useState<any[]>([])

    const [loading, setLoading] =
        useState(true)

    useEffect(() => {

        const cargar = async () => {

            try {

                const data =
                    await clienteService.listarClientes()

                setClientes(data || [])

            } catch (error) {

                console.error("Error cargando clientes", error)

            } finally {

                setLoading(false)

            }

        }

        cargar()

    }, [])

    const options = clientes.map((c) => ({

        value: c.id,

        label: [
            c.nombre,
            c.telefono,
            c.email
        ]
            .filter(Boolean)
            .join(" - ")

    }))

    return (

        <div className="flex flex-col space-y-2 w-full">

            <SearchableSelect

                options={options}

                value={clienteSeleccionado}

                onChange={(id) =>
                    onSeleccionar(
                        id ? Number(id) : null
                    )
                }

                placeholder={
                    loading
                        ? "Cargando clientes..."
                        : "Buscar cliente"
                }

                emptyMessage="Cliente no encontrado."

            />

        </div>

    )

}