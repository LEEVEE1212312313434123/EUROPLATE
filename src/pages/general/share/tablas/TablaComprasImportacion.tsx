"use client"

import { useEffect, useState } from "react"
import { comprasService } from "@/services/general/compras.service"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Globe, Anchor, Loader2, Ship } from "lucide-react"

export default function TablaComprasImportacion() {
    const [compras, setCompras] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchImportaciones = async () => {
            try {
                const data = await comprasService.obtenerComprasImportacion()
                setCompras(data || [])
            } catch (error) {
                console.error("Error cargando importaciones:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchImportaciones()
    }, [])

    return (
        <Card className="shadow-md border-amber-200">
            <CardHeader className="bg-amber-50/50 py-4 border-b border-amber-100">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-amber-900">
                    <Globe className="w-5 h-5 text-amber-600" />
                    Gestión de Importaciones
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-amber-50/30">
                        <TableRow>
                            <TableHead className="text-amber-900">Fecha Registro</TableHead>
                            <TableHead className="text-amber-900">Proveedor / Origen</TableHead>
                            <TableHead className="text-amber-900">Ruta (Puerto O/D)</TableHead>
                            <TableHead className="text-amber-900">Incoterm</TableHead>
                            <TableHead className="text-right text-amber-900">Monto Orig.</TableHead>
                            {/* NUEVA COLUMNA: TOTAL EN SOLES */}
                            <TableHead className="text-right text-amber-900 font-bold">Total (S/)</TableHead>
                            <TableHead className="text-center text-amber-900">Llegada</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10"><Loader2 className="animate-spin mx-auto text-amber-600" /></TableCell></TableRow>
                        ) : compras.length === 0 ? (
                            <TableRow><TableCell colSpan={7} className="text-center py-10 text-muted-foreground">No hay importaciones registradas.</TableCell></TableRow>
                        ) : compras.map((c) => {
                            // Lógica de conversión:
                            // Si moneda_id === 2 (Dólares), multiplicamos por tipo_cambio. 
                            // Si no, usamos el total directamente.
                            const totalSoles = c.moneda_id === 2
                                ? (Number(c.total || 0) * Number(c.tipo_cambio || 1))
                                : Number(c.total || 0);

                            return (
                                <TableRow key={c.id} className="hover:bg-amber-50/20 border-amber-50">
                                    <TableCell className="font-medium text-slate-700">
                                        {c.fecha ? new Date(c.fecha).toLocaleDateString() : '---'}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{c.proveedores?.nombre}</span>
                                            <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">{c.proveedores?.pais}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                            <span className="bg-white border px-1.5 py-0.5 rounded shadow-sm">{c.importaciones?.puerto_origen || 'N/A'}</span>
                                            <Anchor className="h-3 w-3 text-amber-500" />
                                            <span className="bg-white border px-1.5 py-0.5 rounded shadow-sm">{c.importaciones?.puerto_destino || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className="bg-amber-600 hover:bg-amber-700 text-white border-none">
                                            {c.importaciones?.incoterm || 'FOB'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-600">
                                                {c.moneda_id === 2 ? '$' : 'S/'} {Number(c.total || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                            {c.moneda_id === 2 && c.tipo_cambio && (
                                                <span className="text-[10px] text-slate-400 text-right italic">T.C. {c.tipo_cambio}</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    {/* CELDA: TOTAL EN SOLES CALCULADO */}
                                    <TableCell className="text-right">
                                        <div className="flex items-center justify-end gap-1 text-amber-900 font-bold">
                                            <span>S/ {totalSoles.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {c.importaciones?.fecha_llegada ? (
                                            <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-100">
                                                <Ship className="h-3 w-3" />
                                                {new Date(c.importaciones.fecha_llegada).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400">Sin fecha</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}