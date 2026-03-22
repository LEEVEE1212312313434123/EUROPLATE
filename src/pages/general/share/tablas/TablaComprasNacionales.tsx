"use client"

import { useEffect, useState } from "react"
import { comprasService } from "@/services/general/compras.service"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Store, Mail, MapPin } from "lucide-react"

export default function TablaComprasNacionales() {
    const [compras, setCompras] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCompras = async () => {
            try {
                const data = await comprasService.obtenerComprasNacionales()
                setCompras(data || [])
            } catch (error) {
                console.error("Error cargando compras nacionales:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchCompras()
    }, [])

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Store className="w-5 h-5 text-blue-600" />
                    Compras Nacionales
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[120px]">Fecha</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Contacto</TableHead>
                            <TableHead className="text-right">Productos</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600" /></TableCell></TableRow>
                        ) : compras.length === 0 ? (
                            <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No se encontraron registros.</TableCell></TableRow>
                        ) : compras.map((c) => (
                            <TableRow key={c.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">
                                    {c.fecha ? new Date(c.fecha).toLocaleDateString() : '---'}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-slate-900">{c.proveedores?.nombre}</span>
                                        <span className="text-xs flex items-center gap-1 text-slate-500">
                                            <MapPin className="w-3 h-3" /> {c.proveedores?.pais || 'Perú'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs text-slate-600 space-y-1">
                                        {c.proveedores?.email && <div className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.proveedores.email}</div>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right text-slate-600">
                                    {c.compra_detalles?.length || 0} ítems
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-900">
                                    S/ {Number(c.total || 0).toFixed(2)}
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={c.estado === 'PENDIENTE' ? 'outline' : 'default'}
                                        className={c.estado === 'PENDIENTE' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}>
                                        {c.estado}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}