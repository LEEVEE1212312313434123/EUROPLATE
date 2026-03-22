"use client"

import { useEffect, useState } from "react"
import { ventaService } from "@/services/general/venta.service"

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent
} from "@/components/ui/card"

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell
} from "@/components/ui/table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Eye } from "lucide-react"

export default function TablaVentas() {

    const [ventas, setVentas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarVentas()
    }, [])

    const cargarVentas = async () => {

        try {

            const data =
                await ventaService.obtenerVentas()

            setVentas(data)

        } catch (error) {

            console.error("Error cargando ventas", error)

        } finally {

            setLoading(false)

        }

    }

    return (

        <Card className="shadow-md">

            <CardHeader>
                <CardTitle>
                    Historial de Ventas
                </CardTitle>
            </CardHeader>

            <CardContent>

                <Table>

                    <TableHeader>
                        <TableRow>
                            <TableHead>Documento</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Notas</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {loading && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    Cargando ventas...
                                </TableCell>
                            </TableRow>
                        )}

                        {!loading && ventas.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No hay ventas registradas
                                </TableCell>
                            </TableRow>
                        )}

                        {ventas.map((v) => (

                            <TableRow key={v.id}>

                                <TableCell className="font-mono">
                                    {v.serie}-{v.numero}
                                </TableCell>

                                <TableCell>
                                    {v.clientes?.nombre || "Cliente General"}
                                </TableCell>

                                <TableCell>
                                    {new Date(v.fecha).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="font-semibold">
                                    S/ {Number(v.total).toFixed(2)}
                                </TableCell>

                                <TableCell>

                                    <Badge
                                        variant={
                                            v.estado_pago === "PAGADO"
                                                ? "default"
                                                : v.estado_pago === "PARCIAL"
                                                    ? "secondary"
                                                    : "destructive"
                                        }
                                    >
                                        {v.estado_pago}
                                    </Badge>

                                </TableCell>

                                <TableCell>

                                    {v.venta_notas?.length > 0 ? (

                                        <Badge variant="outline">
                                            {v.venta_notas.length} notas
                                        </Badge>

                                    ) : (

                                        <span className="text-muted-foreground text-xs">
                                            Sin notas
                                        </span>

                                    )}

                                </TableCell>

                                <TableCell className="text-right">

                                    <Button
                                        size="sm"
                                        variant="outline"
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver
                                    </Button>

                                </TableCell>

                            </TableRow>

                        ))}

                    </TableBody>

                </Table>

            </CardContent>

        </Card>

    )

}