"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"

import { ProveedorSelector } from "@/pages/general/share/selectors/ProveedorSelector"

interface Props {

    tipoCompra: string
    setTipoCompra: (value: string) => void

    proveedorId: number | null
    setProveedorId: (id: number) => void

    fecha: string
    setFecha: (fecha: string) => void

}

export default function CompraForm({

    tipoCompra,
    setTipoCompra,

    proveedorId,
    setProveedorId,

    fecha,
    setFecha

}: Props) {

    return (

        <div className="grid grid-cols-3 gap-4 items-end">

            {/* PROVEEDOR */}

            <ProveedorSelector
                proveedorSeleccionado={proveedorId}
                onSeleccionar={setProveedorId}
            />

            {/* FECHA */}

            <div className="flex flex-col space-y-2">

                <Label>Fecha</Label>

                <Input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />

            </div>

            {/* TIPO COMPRA */}

            <div className="flex flex-col space-y-2">

                <Label>Tipo Compra</Label>

                <Select
                    value={tipoCompra}
                    onValueChange={setTipoCompra}
                >

                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>

                    <SelectContent>

                        <SelectItem value="NACIONAL">
                            Nacional
                        </SelectItem>

                        <SelectItem value="IMPORTACION">
                            Importación
                        </SelectItem>

                    </SelectContent>

                </Select>

            </div>

        </div>

    )

}