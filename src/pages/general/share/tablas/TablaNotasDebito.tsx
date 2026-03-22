"use client"

import { useEffect, useState } from "react"
import { ventaService } from "@/services/general/venta.service"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Loader2, TrendingUp } from "lucide-react"

export default function TablaNotasDebito() {
    const [notas, setNotas] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        cargarNotas()
    }, [])

    const cargarNotas = async () => {
        try {
            const data = await ventaService.obtenerNotasDebito()
            setNotas(data)
        } catch (error) {
            console.error("Error", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="border-blue-100 shadow-sm">
            <CardHeader className="bg-blue-50/30">
                <CardTitle className="text-blue-800">Notas de Débito (Ajustes (+) )</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nro. Nota</TableHead>
                            <TableHead>Venta Ref.</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead className="text-right">Monto Adicional</TableHead>
                            <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="animate-spin mx-auto" /></TableCell></TableRow>
                        ) : notas.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No hay notas de débito</TableCell></TableRow>
                        ) : notas.map((n) => (
                            <TableRow key={n.id}>
                                <TableCell className="font-bold text-blue-700">{n.serie}-{n.numero}</TableCell>
                                <TableCell>{n.ventas?.serie}-{n.ventas?.numero}</TableCell>
                                <TableCell>{n.ventas?.clientes?.nombre}</TableCell>
                                <TableCell>{new Date(n.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right font-bold">
                                    <div className="flex items-center justify-end text-blue-600 gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        S/ {Number(n.monto).toFixed(2)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1" /> Ver</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}