"use client"

import { useEffect, useState } from "react"
import { productoVariantesService } from "@/services/general/productoVariantes.service"

import { Trash2, Package } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TablaEliminarVariantes() {

    const [variantes, setVariantes] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    const cargarVariantes = async () => {
        try {

            const data =
                await productoVariantesService.obtenerVariantesPorTipo()

            setVariantes(data)

        } catch (error) {
            console.error("Error cargando variantes", error)
        }
    }

    useEffect(() => {
        cargarVariantes()
    }, [])

    const eliminarVariante = async (id: number) => {

        if (!confirm("¿Eliminar esta variante?"))
            return

        try {

            setLoading(true)

            const res =
                await productoVariantesService.eliminarVariante(id)

            if (res?.tipo === "desactivado") {
                alert("La variante tenía movimientos y fue desactivada.")
            } else {
                alert("Variante eliminada correctamente.")
            }

            await cargarVariantes()

        } catch (error: any) {
            alert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Variantes de Productos
                </CardTitle>
            </CardHeader>

            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Producto</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Precio</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead className="text-right">
                                Acción
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {variantes.map((v) => (
                            <TableRow key={v.id}>
                                <TableCell>{v.id}</TableCell>

                                <TableCell className="font-semibold">
                                    {v.producto_nombre}
                                </TableCell>

                                <TableCell className="font-mono">
                                    {v.sku}
                                </TableCell>

                                <TableCell>
                                    S/ {Number(v.precio_venta).toFixed(2)}
                                </TableCell>

                                <TableCell>
                                    <Badge variant="secondary">
                                        Activo
                                    </Badge>
                                </TableCell>

                                <TableCell className="text-right">
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={loading}
                                        onClick={() =>
                                            eliminarVariante(v.id)
                                        }
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {variantes.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="text-center text-muted-foreground py-10"
                                >
                                    No hay variantes registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}