"use client"

import { EditableCombobox } from "@/pages/general/share/EditableCombobox"

type Atributo = {
    id: number
    nombre: string
}

type Valor = {
    id: number
    atributo_id: number
    valor: string
}

type Props = {

    atributos: Atributo[]
    valores: Record<number, Valor[]>
    seleccionados: Record<number, string>

    onSeleccionar: (atributoId: number, valor: string) => void

}

export function AtributosSelector({
    atributos,
    valores,
    seleccionados,
    onSeleccionar
}: Props) {

    if (!atributos.length) {

        return (

            <div className="text-sm text-gray-500">
                Este producto no tiene atributos
            </div>

        )

    }

    return (

        <div className="space-y-4">

            <h2 className="font-semibold text-lg">
                Atributos de la nueva variante
            </h2>

            {/* CONTENEDOR CON SCROLL */}
            <div className="overflow-x-auto">

                <div className="flex gap-6 min-w-max">

                    {atributos.map(a => (

                        <div
                            key={a.id}
                            className="flex flex-col min-w-[200px] space-y-2"
                        >

                            <label className="text-sm font-medium">
                                {a.nombre}
                            </label>

                            <EditableCombobox

                                options={(valores[a.id] || []).map(v => ({
                                    value: v.valor,
                                    label: v.valor
                                }))}

                                value={seleccionados[a.id] || ""}

                                onChange={(val) =>
                                    onSeleccionar(a.id, val)
                                }

                                placeholder={`Seleccionar ${a.nombre}`}

                            />

                        </div>

                    ))}

                </div>

            </div>

        </div>

    )

}