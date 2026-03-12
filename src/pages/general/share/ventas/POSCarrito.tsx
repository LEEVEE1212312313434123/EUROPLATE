"use client"

import { Trash2, Plus, Minus, ShoppingCart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"

interface Props {
    carrito: any[]
    setCarrito: (carrito: any[]) => void
}

export default function POSCarrito({
    carrito,
    setCarrito
}: Props) {

    const total = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

    function cambiarCantidad(varianteId: number, cantidad: number) {
        if (cantidad <= 0) return
        const nuevoCarrito = carrito.map(item =>
            item.variante_id === varianteId ? { ...item, cantidad } : item
        )
        setCarrito(nuevoCarrito)
    }

    function aumentar(varianteId: number) {
        const item = carrito.find(i => i.variante_id === varianteId)
        if (item) cambiarCantidad(varianteId, item.cantidad + 1)
    }

    function disminuir(varianteId: number) {
        const item = carrito.find(i => i.variante_id === varianteId)
        if (item && item.cantidad > 1) cambiarCantidad(varianteId, item.cantidad - 1)
    }

    function eliminar(varianteId: number) {
        setCarrito(carrito.filter(item => item.variante_id !== varianteId))
    }

    return (
        <Card className="flex flex-col w-full shadow-lg border-muted-foreground/10 bg-card overflow-hidden">
            <CardHeader className="py-3 px-4 bg-muted/20 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-primary" />
                        Detalle de Venta
                    </CardTitle>
                    <Badge variant="secondary" className="text-[10px] h-5 px-2 font-black">
                        {carrito.length} ITEMS
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-0 bg-white">
                <ScrollArea className="h-[240px]">
                    {carrito.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[220px] text-muted-foreground p-4">
                            <ShoppingCart className="h-10 w-10 mb-2 opacity-10" />
                            <p className="text-[11px] font-medium text-center italic">
                                Carrito vacío.<br />Agregue productos.
                            </p>
                        </div>
                    ) : (
                        <div className="px-4">
                            {carrito.map((item, index) => (
                                <div key={item.variante_id}>
                                    <div className="py-3 group">
                                        <div className="flex justify-between items-start mb-2 gap-3">
                                            <div className="flex-1 min-w-0">
                                                <TooltipProvider delayDuration={200}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            {/* 1. LINE CLAMP: Máximo 2 líneas y corta palabras largas */}
                                                            <h4 className="text-[12px] font-bold leading-tight line-clamp-2 break-words cursor-help text-foreground hover:text-primary transition-colors">
                                                                {item.nombre}
                                                            </h4>
                                                        </TooltipTrigger>
                                                        {/* 2. TOOLTIP: Fondo blanco, texto negro y sombra para legibilidad */}
                                                        <TooltipContent
                                                            side="top"
                                                            className="max-w-[250px] bg-white text-black border border-slate-200 shadow-xl p-2 text-[11px] font-semibold"
                                                        >
                                                            <p className="leading-relaxed">{item.nombre}</p>
                                                            {item.sku && <p className="text-[9px] text-muted-foreground mt-1 border-t pt-1">SKU: {item.sku}</p>}
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>

                                                {/* SKU VISIBLE: Debajo del nombre */}
                                                <span className="text-[10px] text-muted-foreground font-mono block mt-1 bg-muted/30 w-fit px-1 rounded">
                                                    SKU: {item.sku || 'N/A'}
                                                </span>
                                            </div>

                                            <div className="text-[12px] font-bold text-foreground whitespace-nowrap pt-0.5">
                                                S/ {(item.precio * item.cantidad).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-1">
                                            <div className="flex items-center bg-muted/40 border rounded-md p-0.5 shadow-sm">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 hover:bg-white transition-all"
                                                    onClick={() => disminuir(item.variante_id)}
                                                >
                                                    <Minus className="h-3 w-3" />
                                                </Button>

                                                <span className="w-8 text-center text-[11px] font-black">
                                                    {item.cantidad}
                                                </span>

                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 hover:bg-white transition-all"
                                                    onClick={() => aumentar(item.variante_id)}
                                                >
                                                    <Plus className="h-3 w-3" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-muted-foreground font-medium">
                                                    S/ {item.precio.toFixed(2)} c/u
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                    onClick={() => eliminar(item.variante_id)}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    {index !== carrito.length - 1 && <Separator className="opacity-40" />}
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>

            <CardFooter className="flex flex-col p-0 border-t bg-muted/5">
                <div className="w-full flex justify-between items-center px-4 py-4">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Total Orden</span>
                    <span className="text-xl font-black text-primary">
                        S/ {total.toFixed(2)}
                    </span>
                </div>
                <div className="w-full bg-muted/20 py-1.5 border-t text-[8px] text-center text-muted-foreground uppercase tracking-[0.3em] font-bold">
                    Fin del detalle
                </div>
            </CardFooter>
        </Card>
    )
}