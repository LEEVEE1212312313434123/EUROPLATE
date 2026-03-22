"use client"

import { Plus, Trash2, Wallet, CreditCard, Banknote, Landmark } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"

interface Pago {
    metodo_pago: string
    monto: number
}

interface Props {
    pagos: Pago[]
    setPagos: (pagos: Pago[]) => void
}

export default function POSMetodosPago({
    pagos,
    setPagos
}: Props) {

    function agregarMetodo() {
        setPagos([
            ...pagos,
            {
                metodo_pago: "EFECTIVO",
                monto: 0
            }
        ])
    }

    function actualizarMetodo(index: number, campo: keyof Pago, valor: any) {
        const nuevos = [...pagos]
        nuevos[index] = {
            ...nuevos[index],
            [campo]: valor
        }
        setPagos(nuevos)
    }

    function eliminarMetodo(index: number) {
        const nuevos = pagos.filter((_, i) => i !== index)
        setPagos(nuevos)
    }

    const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto || 0), 0)

    return (
        <div className="space-y-4 p-1">
            <div className="flex justify-between items-center">
                <div className="space-y-0.5">
                    <Label className="text-sm font-bold flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-primary" />
                        Métodos de Pago
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Define cómo pagará el cliente</p>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={agregarMetodo}
                    className="h-8 border-dashed border-primary text-primary hover:bg-primary/5 hover:text-primary"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Añadir
                </Button>
            </div>

            <div className="space-y-3">
                {pagos.length === 0 ? (
                    <div className="text-center py-6 border rounded-lg bg-muted/20 border-dashed">
                        <p className="text-xs text-muted-foreground italic">No se han registrado pagos</p>
                    </div>
                ) : (
                    pagos.map((pago, index) => (
                        <div key={index} className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                            {/* Selector de Método */}
                            <div className="flex-1">
                                <Select
                                    value={pago.metodo_pago}
                                    onValueChange={(val) => actualizarMetodo(index, "metodo_pago", val)}
                                >
                                    <SelectTrigger className="h-10 text-xs font-medium">
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="EFECTIVO" className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <Banknote className="h-3.5 w-3.5 text-green-600" />
                                                Efectivo
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="TARJETA" className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="h-3.5 w-3.5 text-blue-600" />
                                                Tarjeta
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="TRANSFERENCIA" className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <Landmark className="h-3.5 w-3.5 text-purple-600" />
                                                Transferencia
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Input de Monto */}
                            <div className="relative w-32">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground">
                                    S/
                                </span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    className="h-10 pl-8 text-xs font-bold"
                                    value={pago.monto || ""}
                                    onChange={e => actualizarMetodo(index, "monto", Number(e.target.value))}
                                />
                            </div>

                            {/* Botón Eliminar */}
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => eliminarMetodo(index)}
                                className="h-10 w-10 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))
                )}
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between items-center bg-muted/30 p-2.5 rounded-lg border border-muted-foreground/10 shadow-inner">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    Total Registrado
                </span>
                <Badge variant="outline" className="text-sm font-black bg-white border-primary/20 text-primary px-3 py-1">
                    S/ {totalPagado.toFixed(2)}
                </Badge>
            </div>
        </div>
    )
}