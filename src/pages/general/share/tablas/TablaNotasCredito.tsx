"use client"

import { useEffect, useState } from "react"
import { ventaService } from "@/services/general/venta.service"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileDown, Eye, Loader2 } from "lucide-react"

export default function TablaNotasCredito() {
    const [notas, setNotas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarNotas()
    }, [])

    const cargarNotas = async () => {
        try {
            const data = await ventaService.obtenerNotasCredito()
            setNotas(data)
        } catch (error) {
            console.error("Error", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-red-100 shadow-sm">
            <CardHeader className="bg-red-50/30">
                <CardTitle className="text-red-800">Notas de Crédito (Devoluciones)</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nro. Nota</TableHead>
                            <TableHead>Venta Ref.</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Monto</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                        ) : notas.map((n) => (
                            <TableRow key={n.id}>
                                <TableCell className="font-bold">{n.serie}-{n.numero}</TableCell>
                                <TableCell className="text-muted-foreground">{n.ventas?.serie}-{n.ventas?.numero}</TableCell>
                                <TableCell>{n.ventas?.clientes?.nombre}</TableCell>
                                <TableCell><Badge variant="outline">{n.motivo}</Badge></TableCell>
                                <TableCell>{new Date(n.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-bold text-red-600">- S/ {Number(n.monto).toFixed(2)}</TableCell>
                                <TableCell className="text-right flex justify-end gap-2">
                                    <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                                    <Button size="icon" variant="ghost"><FileDown className="h-4 w-4" /></Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}