"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { VarianteSelector } from "@/pages/general/share/selectors/VarianteSelect"
import { AlmacenSelector } from "@/pages/general/share/selectors/AlmacenSelector"

type Detalle = {
    variante_id?: number
    cantidad?: number
    precio?: number
    almacen_id?: number
}

interface Props {
    detalles: Detalle[]
    setDetalles: (detalles: Detalle[]) => void
}

export default function CompraDetallesTable({ detalles, setDetalles }: Props) {

    function agregarDetalle() {

        setDetalles([
            ...detalles,
            {
                variante_id: undefined,
                cantidad: 1,
                precio: 0,
                almacen_id: undefined
            }
        ])

    }

    function actualizarDetalle(
        index: number,
        campo: keyof Detalle,
        valor: any
    ) {

        const nuevos = [...detalles]

        nuevos[index] = {
            ...nuevos[index],
            [campo]: valor
        }

        setDetalles(nuevos)

    }

    function eliminarDetalle(index: number) {

        const nuevos = detalles.filter((_, i) => i !== index)
        setDetalles(nuevos)

    }

    return (

        <Card>

            <CardHeader>
                <CardTitle>Detalle de Compra</CardTitle>
            </CardHeader>

            <CardContent>

                <Table>

                    <TableHeader>

                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>Almacén</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead></TableHead>
                        </TableRow>

                    </TableHeader>

                    <TableBody>

                        {detalles.map((detalle, index) => (

                            <TableRow key={index}>

                                {/* PRODUCTO */}

                                <TableCell>

                                    <VarianteSelector
                                        varianteSeleccionada={detalle.variante_id ?? null}
                                        onSeleccionar={(id) =>
                                            actualizarDetalle(index, "variante_id", id)
                                        }
                                    />

                                </TableCell>

                                {/* ALMACEN */}

                                <TableCell>

                                    <AlmacenSelector
                                        almacenSeleccionado={detalle.almacen_id ?? null}
                                        onSeleccionar={(id) =>
                                            actualizarDetalle(index, "almacen_id", id)
                                        }
                                    />

                                </TableCell>

                                {/* CANTIDAD */}

                                <TableCell>

                                    <Input
                                        type="number"
                                        value={detalle.cantidad ?? ""}
                                        onChange={(e) =>
                                            actualizarDetalle(
                                                index,
                                                "cantidad",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                </TableCell>

                                {/* PRECIO */}

                                <TableCell>

                                    <Input
                                        type="number"
                                        value={detalle.precio ?? ""}
                                        onChange={(e) =>
                                            actualizarDetalle(
                                                index,
                                                "precio",
                                                Number(e.target.value)
                                            )
                                        }
                                    />

                                </TableCell>

                                {/* ELIMINAR */}

                                <TableCell>

                                    <Button
                                        variant="destructive"
                                        onClick={() => eliminarDetalle(index)}
                                    >
                                        Eliminar
                                    </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

                <Button
                    className="mt-4"
                    onClick={agregarDetalle}
                >
                    Agregar producto
                </Button>

            </CardContent>

        </Card>

    )

}