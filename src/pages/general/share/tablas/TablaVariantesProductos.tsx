"use client"

import { useEffect, useState } from "react"
import { productoVariantesService } from "@/services/general/productoVariantes.service"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription // Importante para corregir el warning
} from "@/components/ui/dialog"
import { Loader2, Box, QrCode, ListFilter } from "lucide-react"

export default function TablaVariantesProductos() {
    const [variantes, setVariantes] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let isMounted = true; // Previene fugas de memoria y múltiples llamadas

        const cargarVariantes = async () => {
            try {
                const data = await productoVariantesService.obtenerVariantesFormateadas()
                if (isMounted) setVariantes(data || [])
            } catch (error) {
                console.error("Error cargando variantes:", error)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        cargarVariantes()
        return () => { isMounted = false }
    }, [])

    return (
        <Card className="shadow-sm border-slate-200">
            <CardHeader className="bg-slate-50/50 py-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Box className="w-5 h-5 text-emerald-600" />
                    Inventario de Variantes
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead className="w-[300px]">Producto Base</TableHead>
                            <TableHead>SKU / Código</TableHead>
                            <TableHead className="text-center">Características</TableHead>
                            <TableHead className="text-right">Precio Venta</TableHead>
                            <TableHead className="text-center">Estado</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">
                                    <Loader2 className="animate-spin mx-auto text-emerald-600" />
                                </TableCell>
                            </TableRow>
                        ) : variantes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                                    No existen variantes registradas.
                                </TableCell>
                            </TableRow>
                        ) : (
                            variantes.map((v) => (
                                <TableRow key={v.id} className="hover:bg-slate-50/30 transition-colors">
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-900">{v.producto_nombre}</span>
                                            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                                                ID: {v.id}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <QrCode className="w-3.5 h-3.5 text-slate-400" />
                                            <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded text-slate-700 border border-slate-200">
                                                {v.sku || 'SIN-SKU'}
                                            </span>
                                        </div>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        {v.caracteristicas && v.caracteristicas.length > 0 ? (
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm" className="h-7 gap-2 border-dashed border-slate-300 hover:border-emerald-500 hover:text-emerald-600">
                                                        <ListFilter className="w-3 h-3" />
                                                        <span>{v.caracteristicas.length} Atributos</span>
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="sm:max-w-[425px]">
                                                    <DialogHeader>
                                                        <DialogTitle className="flex items-center gap-2">
                                                            <Box className="w-5 h-5 text-emerald-600" />
                                                            Características
                                                        </DialogTitle>
                                                        {/* SOLUCIÓN AL WARNING: Se agrega DialogDescription */}
                                                        <DialogDescription>
                                                            Detalle técnico de la variante: {v.producto_nombre}
                                                        </DialogDescription>
                                                    </DialogHeader>

                                                    <div className="grid grid-cols-1 gap-2 mt-4">
                                                        {v.caracteristicas.map((c: any, index: number) => (
                                                            <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                                                                <span className="text-xs text-slate-500 font-medium uppercase">{c.nombre}</span>
                                                                <span className="text-sm font-bold text-slate-800">{c.valor}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">Sin atributos</span>
                                        )}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="font-bold text-emerald-700">
                                            S/ {Number(v.precio_venta || 0).toFixed(2)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="text-[10px] border-emerald-200 text-emerald-700 bg-emerald-50 font-bold">
                                            ACTIVO
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}