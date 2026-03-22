"use client"

import { useEffect, useState } from "react"
import { comprasService } from "@/services/general/compras.service"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, PackageSearch, Tag } from "lucide-react"

export default function TablaProductosComprados() {
    const [productos, setProductos] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarData = async () => {
            try {
                const data = await comprasService.obtenerHistorialProductos()
                setProductos(data || [])
            } catch (error) {
                console.error("Error:", error)
            } finally {
                setLoading(false)
            }
        }
        cargarData()
    }, [])

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <PackageSearch className="w-5 h-5 text-indigo-600" />
                    Historial de Productos Comprados
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Producto</TableHead>
                            <TableHead>SKU</TableHead>
                            <TableHead>Proveedor</TableHead>
                            <TableHead>Fecha Compra</TableHead>
                            <TableHead className="text-right">Cantidad</TableHead>
                            <TableHead className="text-right">Costo Unit.</TableHead>
                            {/* NUEVA CABECERA */}
                            <TableHead className="text-right font-semibold">Total</TableHead>
                            <TableHead className="text-center">Tipo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-indigo-600" /></TableCell></TableRow>
                        ) : productos.length === 0 ? (
                            <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground">No hay registros de productos comprados.</TableCell></TableRow>
                        ) : productos.map((item) => {
                            // Cálculo del total por fila
                            const totalFila = Number(item.cantidad) * Number(item.precio);

                            return (
                                <TableRow key={item.id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        {item.producto_variantes?.productos?.nombre || 'Producto no encontrado'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-1 text-xs font-mono text-slate-500">
                                            <Tag className="w-3 h-3" />
                                            {item.producto_variantes?.sku || 'S/S'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-600 text-sm">
                                        {item.compras?.proveedores?.nombre || '---'}
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {item.compras?.fecha ? new Date(item.compras.fecha).toLocaleDateString() : '---'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-indigo-700">
                                        {Number(item.cantidad).toLocaleString()}
                                    </TableCell>
                                    <TableCell className="text-right font-medium">
                                        S/ {Number(item.precio).toFixed(2)}
                                    </TableCell>
                                    {/* NUEVA CELDA DE TOTAL */}
                                    <TableCell className="text-right font-bold text-slate-900">
                                        S/ {totalFila.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className={item.compras?.tipo_compra === 'IMPORTACION' ? 'border-amber-200 text-amber-700 bg-amber-50' : 'border-blue-200 text-blue-700 bg-blue-50'}>
                                            {item.compras?.tipo_compra}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}