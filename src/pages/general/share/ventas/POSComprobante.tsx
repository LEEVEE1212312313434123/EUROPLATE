"use client"

import POSMetodosPago from "@/pages/general/share/ventas/POSMetodosPago"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptText, CreditCard } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface Props {
    tipoComprobante: string
    setTipoComprobante: (v: string) => void
    pagos: any[]
    setPagos: (pagos: any[]) => void
}

export default function POSComprobante({
    tipoComprobante,
    setTipoComprobante,
    pagos,
    setPagos
}: Props) {
    return (
        <Card className="shadow-lg border-muted-foreground/10 overflow-hidden bg-card">
            <CardHeader className="pb-4 bg-muted/20 border-b">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                    <ReceiptText className="h-5 w-5 text-primary" />
                    Finalizar Venta
                </CardTitle>
            </CardHeader>

            <CardContent className="p-5 space-y-6">
                {/* Sección Tipo de Comprobante */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="tipo-comprobante" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Tipo de Comprobante
                        </Label>
                    </div>

                    <Select
                        value={tipoComprobante}
                        onValueChange={setTipoComprobante}
                    >
                        <SelectTrigger id="tipo-comprobante" className="w-full bg-background font-medium h-11 border-muted-foreground/20 focus:ring-primary">
                            <SelectValue placeholder="Seleccione documento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="BOLETA" className="font-medium">Boleta de Venta</SelectItem>
                            <SelectItem value="FACTURA" className="font-medium">Factura Electrónica</SelectItem>
                            <SelectItem value="TICKET" className="font-medium">Ticket de Venta</SelectItem>
                            <SelectItem value="MANUAL" className="font-medium italic">Nota Manual</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Separator className="bg-muted-foreground/10" />

                {/* Sección Métodos de Pago */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Método de Pago
                        </Label>
                    </div>

                    <div className="bg-muted/5 rounded-lg border border-dashed p-1">
                        <POSMetodosPago
                            pagos={pagos}
                            setPagos={setPagos}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}