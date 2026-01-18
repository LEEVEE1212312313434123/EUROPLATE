import { Trash2, CreditCard, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { MetodoPagoDTO } from "@/types/ventas/venta.dto";

interface Props {
    subtotal: number;
    igv: number;
    total: number;
    tipoComprobante: string;
    setTipoComprobante: (val: string) => void;
    pagos: MetodoPagoDTO[];
    setPagos: (pagos: MetodoPagoDTO[]) => void;
    montoPagado: number;
    pagoCompleto: boolean;
}

export function InformacionPago({
    total,
    tipoComprobante,
    setTipoComprobante,
    pagos,
    setPagos,
    montoPagado,
    pagoCompleto,
}: Props) {
    const agregarMetodoPago = () => {
        if (pagoCompleto) return;

        const restante = Math.max(0, total - montoPagado);
        setPagos([
            ...pagos,
            { metodo: "Efectivo", nro_operacion: "", monto: restante },
        ]);
    };

    const actualizarPago = (
        index: number,
        campo: keyof MetodoPagoDTO,
        valor: any
    ) => {
        const nuevos = [...pagos];
        nuevos[index] = { ...nuevos[index], [campo]: valor };
        setPagos(nuevos);
    };

    const eliminarPago = (index: number) => {
        if (pagos.length === 1) return;
        setPagos(pagos.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex gap-2 items-center">
                <Label className="text-xs text-primary font-bold">TIPO</Label>
                <Select value={tipoComprobante} onValueChange={setTipoComprobante}>
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Boleta">Boleta</SelectItem>
                        <SelectItem value="Factura">Factura</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {pagos.map((pago, index) => (
                <div
                    key={index}
                    className="grid grid-cols-12 gap-2 items-end border-b pb-2"
                >
                    <div className="col-span-3">
                        <Label className="text-[10px] text-primary font-bold">MEDIO</Label>
                        <Select
                            value={pago.metodo}
                            onValueChange={(v) =>
                                actualizarPago(index, "metodo", v)
                            }
                        >
                            <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Efectivo">
                                    Efectivo
                                </SelectItem>
                                <SelectItem value="Yape">Yape</SelectItem>
                                <SelectItem value="Plin">Plin</SelectItem>
                                <SelectItem value="Tarjeta">
                                    Tarjeta
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="col-span-3">
                        <Label className="text-[10px] text-primary font-bold">REFERENCIA</Label>
                        <Input
                            className="h-8 text-xs"
                            value={pago.nro_operacion}
                            onChange={(e) =>
                                actualizarPago(
                                    index,
                                    "nro_operacion",
                                    e.target.value
                                )
                            }
                        />
                    </div>

                    <div className="col-span-2">
                        <Label className="text-[10px] text-primary font-bold">MONTO</Label>
                        <Input
                            type="text"
                            inputMode="decimal"
                            placeholder="0.00"
                            className="h-8 text-xs text-right"
                            value={pago.monto === 0 ? "" : pago.monto}
                            onChange={(e) => {
                                const value = e.target.value.replace(",", ".");
                                if (/^\d*\.?\d{0,2}$/.test(value)) {
                                    actualizarPago(index, "monto", value === "" ? 0 : Number(value));
                                }
                            }}
                        />
                    </div>

                    {index === pagos.length - 1 && (
                        <div className="col-span-2">
                            <Button
                                size="icon"
                                variant="outline"
                                onClick={agregarMetodoPago}
                                disabled={pagoCompleto}
                            >
                                <PlusCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    <div className="col-span-2">
                        <Button
                            size="icon"
                            variant="ghost"
                            disabled={pagos.length === 1}
                            onClick={() => eliminarPago(index)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            ))}

            <div
                className={`text-xs font-medium p-2 rounded ${pagoCompleto
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-orange-50 text-orange-700"
                    }`}
            >
                {pagoCompleto
                    ? "Monto cubierto correctamente"
                    : `Faltan ${(total - montoPagado).toFixed(2)}`}
            </div>
        </div>
    );
}
