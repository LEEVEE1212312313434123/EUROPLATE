"use client"

import { useEffect, useState } from "react"
import { ventaService } from "@/services/general/venta.service"
import {
    FileText,
    Search,
    AlertCircle,
    ClipboardList,
    Save
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function CrearNotaVenta() {
    const [ventas, setVentas] = useState<any[]>([])
    const [ventaSeleccionada, setVentaSeleccionada] = useState<any>(null)
    const [tipoNota, setTipoNota] = useState("CREDITO")
    const [motivo, setMotivo] = useState("")
    const [detalles, setDetalles] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await ventaService.obtenerVentas()
                setVentas(data)
            } catch (error) {
                console.error("Error cargando ventas", error)
            }
        }
        load()
    }, [])

    const seleccionarVenta = (ventaId: string) => {

        const venta = ventas.find(v => v.id === Number(ventaId))

        setVentaSeleccionada(venta)

        if (!venta) return

        /* =========================
           CALCULAR DEVOLUCIONES
        ========================= */

        const mapaDevueltos: any = {}

        venta.venta_notas?.forEach((nota: any) => {

            if (nota.tipo_nota !== "CREDITO") return

            nota.venta_nota_detalles?.forEach((d: any) => {

                if (!mapaDevueltos[d.variante_id])
                    mapaDevueltos[d.variante_id] = 0

                mapaDevueltos[d.variante_id] += d.cantidad

            })

        })

        /* =========================
           CALCULAR DISPONIBLE
        ========================= */

        const detallesBase = venta.venta_detalles.map((d: any) => {

            const devuelto = mapaDevueltos[d.variante_id] ?? 0

            const disponible = d.cantidad - devuelto

            return {

                variante_id: d.variante_id,
                almacen_id: d.almacen_id,

                nombre: d.producto_variantes?.productos?.nombre || "Producto",
                sku: d.producto_variantes?.sku,

                precio: d.precio,

                cantidad_max: disponible, // 🔹 ahora sí es el disponible real

                cantidad: 0

            }

        })

        setDetalles(detallesBase)

    }

    const cambiarCantidad = (index: number, value: number) => {
        const copia = [...detalles]
        // Validación para no exceder el máximo vendido
        const cant = Math.min(Math.max(0, value), copia[index].cantidad_max)
        copia[index].cantidad = cant
        setDetalles(copia)
    }

    const crearNota = async () => {
        if (!ventaSeleccionada) return

        const detallesEnviar = detalles
            .filter(d => d.cantidad > 0)
            .map(d => ({
                variante_id: d.variante_id,
                cantidad: d.cantidad,
                precio: d.precio
            }))

        if (detallesEnviar.length === 0) {
            alert("Seleccione al menos un producto con cantidad mayor a 0")
            return
        }

        if (!motivo.trim()) {
            alert("Debe ingresar un motivo para la nota")
            return
        }

        try {
            setLoading(true)
            await ventaService.crearNotaVenta({
                venta_id: ventaSeleccionada.id,
                tipo_nota: tipoNota,
                motivo,
                detalles: detallesEnviar
            })
            alert("Nota creada exitosamente")
            // Resetear formulario
            setVentaSeleccionada(null)
            setMotivo("")
            setDetalles([])
        } catch (error: any) {

            console.error("ERROR CREAR NOTA:", error)

            alert(
                error?.message ||
                "Ocurrió un error inesperado al crear la nota"
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto py-6 max-w-5xl space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        Notas de Crédito / Débito
                    </h2>
                    <p className="text-muted-foreground">Emisión de documentos modificatorios para ventas realizadas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* PANEL IZQUIERDO: CONFIGURACIÓN */}
                <Card className="md:col-span-1 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            Documento Origen
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Buscar Venta</Label>
                            <Select onValueChange={seleccionarVenta}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccione documento..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ventas.map(v => (
                                        <SelectItem key={v.id} value={v.id.toString()}>
                                            {v.serie}-{v.numero} | {v.total}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Tipo de Nota</Label>
                            <Select value={tipoNota} onValueChange={setTipoNota}>
                                <SelectTrigger className={tipoNota === 'CREDITO' ? "text-blue-600 font-semibold" : "text-orange-600 font-semibold"}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CREDITO">Nota de Crédito (-)</SelectItem>
                                    <SelectItem value="DEBITO">Nota de Débito (+)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Motivo / Sustento</Label>
                            <Textarea
                                value={motivo}
                                onChange={(e) => setMotivo(e.target.value)}
                                placeholder="Escriba el motivo legal de la modificación..."
                                className="min-h-[100px] resize-none"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* PANEL DERECHO: DETALLES DE PRODUCTOS */}
                <Card className="md:col-span-2 shadow-md border-primary/10">
                    <CardHeader className="bg-muted/30 pb-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-lg">Detalle de Productos</CardTitle>
                                <CardDescription>Indique las cantidades a devolver o ajustar.</CardDescription>
                            </div>
                            {ventaSeleccionada && (
                                <Badge variant="outline" className="text-xs font-mono">
                                    CLIENTE: {ventaSeleccionada.clientes?.nombre || 'General'}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent className="p-0">
                        {!ventaSeleccionada ? (
                            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground opacity-50">
                                <Search className="h-12 w-12 mb-2" />
                                <p>Seleccione una venta para ver sus items</p>
                            </div>
                        ) : (
                            <ScrollArea className="h-[350px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[40%]">Producto / SKU</TableHead>
                                            <TableHead className="text-center">Precio</TableHead>
                                            <TableHead className="text-center">Vendido</TableHead>
                                            <TableHead className="text-right w-[150px]">Cant. Nota</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {detalles.map((d, i) => (
                                            <TableRow key={i}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-bold text-sm leading-none">{d.nombre}</span>
                                                        <span className="text-[10px] text-muted-foreground font-mono mt-1 italic">SKU: {d.sku}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">
                                                    S/ {Number(d.precio).toFixed(2)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="secondary">{d.cantidad_max}</Badge>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end">
                                                        <Input
                                                            type="number"
                                                            value={d.cantidad}
                                                            onChange={(e) => cambiarCantidad(i, Number(e.target.value))}
                                                            className="w-20 text-center h-8 font-bold border-primary/20"
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </ScrollArea>
                        )}
                    </CardContent>

                    {ventaSeleccionada && (
                        <CardFooter className="flex flex-col bg-muted/20 py-4 border-t">
                            <div className="w-full flex justify-between items-center mb-4">
                                <div className="text-sm text-muted-foreground italic flex items-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    El total se recalculará según las cantidades ingresadas.
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Total a Ajustar</p>
                                    <p className="text-2xl font-black text-primary">
                                        S/ {detalles.reduce((acc, curr) => acc + (curr.cantidad * curr.precio), 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                            <Button
                                onClick={crearNota}
                                className="w-full gap-2 h-11 text-lg font-bold shadow-lg"
                                disabled={loading}
                            >
                                {loading ? "Procesando..." : (
                                    <>
                                        <Save className="h-5 w-5" />
                                        Generar {tipoNota === 'CREDITO' ? 'Nota de Crédito' : 'Nota de Débito'}
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    )
}