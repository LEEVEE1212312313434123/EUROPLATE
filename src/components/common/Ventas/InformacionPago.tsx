import { Trash2, PlusCircle, Receipt } from "lucide-react";
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

    const actualizarPago = (index: number, campo: keyof MetodoPagoDTO, valor: any) => {
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
            {/* Cabecera Tipo Comprobante */}
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-lg border border-dashed border-slate-200">
                <div className="flex items-center gap-2 min-w-[100px]">
                    <Receipt className="w-4 h-4 text-slate-400" />
                    <Label className="text-[10px] font-bold uppercase text-slate-500">Comprobante</Label>
                </div>
                <Select value={tipoComprobante} onValueChange={setTipoComprobante}>
                    <SelectTrigger className="h-8 bg-white">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Boleta">Boleta</SelectItem>
                        <SelectItem value="Factura">Factura</SelectItem>
                        <SelectItem value="NotaVenta">Nota de Venta</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Listado de Pagos */}
            <div className="space-y-3">
                {pagos.map((pago, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-12 gap-2 items-end bg-white p-2 rounded-md border border-slate-100 shadow-sm animate-in fade-in duration-200"
                    >
                        {/* MEDIO */}
                        <div className="col-span-3">
                            <Label className="text-[9px] text-slate-400 font-bold uppercase ml-1">Medio</Label>
                            <Select
                                value={pago.metodo}
                                onValueChange={(v) => actualizarPago(index, "metodo", v)}
                            >
                                <SelectTrigger className="h-8 text-xs bg-slate-50 border-none shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Efectivo">Efectivo</SelectItem>
                                    <SelectItem value="Yape">Yape</SelectItem>
                                    <SelectItem value="Plin">Plin</SelectItem>
                                    <SelectItem value="Tarjeta">Tarjeta</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* REFERENCIA */}
                        <div className="col-span-3">
                            <Label className="text-[9px] text-slate-400 font-bold uppercase ml-1">Referencia</Label>
                            <Input
                                className="h-8 text-xs focus-visible:ring-1"
                                placeholder="Opcional"
                                value={pago.nro_operacion}
                                onChange={(e) => actualizarPago(index, "nro_operacion", e.target.value)}
                            />
                        </div>

                        {/* MONTO CON SOPORTE DECIMAL CORREGIDO */}
                        <div className="col-span-3">
                            <Label className="text-[9px] text-slate-400 font-bold uppercase ml-1">Monto</Label>
                            <div className="relative">
                                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">S/</span>
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    placeholder="0.00"
                                    className="h-8 text-xs text-right pl-6 pr-2 font-bold text-blue-600 bg-blue-50/30 border-none"
                                    // Mostramos el valor tal cual, si es 0 mostramos vacío para facilitar escritura
                                    value={pago.monto === 0 ? "" : pago.monto}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(",", ".");
                                        // Regex que permite: vacío, solo números, o números con un punto y hasta 2 decimales
                                        if (val === "" || /^\d*\.?\d{0,2}$/.test(val)) {
                                            // Actualizamos el estado. Nota: Si termina en "." pasamos el string para no perder el punto
                                            // pero la interfaz lo manejará como número al final del cálculo.
                                            actualizarPago(index, "monto", val);
                                        }
                                    }}
                                    onBlur={(e) => {
                                        // Al perder el foco, nos aseguramos de que sea un número válido
                                        const num = parseFloat(e.target.value) || 0;
                                        actualizarPago(index, "monto", num);
                                    }}
                                />
                            </div>
                        </div>

                        {/* ACCIONES */}
                        <div className="col-span-3 flex items-center justify-end gap-1">
                            {index === pagos.length - 1 && (
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                                    onClick={agregarMetodoPago}
                                    disabled={pagoCompleto}
                                    type="button"
                                >
                                    <PlusCircle className="w-4 h-4" />
                                </Button>
                            )}
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50"
                                disabled={pagos.length === 1}
                                onClick={() => eliminarPago(index)}
                                type="button"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Estado del Pago */}
            <div
                className={`text-[11px] font-bold p-3 rounded-lg border flex items-center justify-between ${pagoCompleto
                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                    : "bg-orange-50 text-orange-700 border-orange-100"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${pagoCompleto ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                    {pagoCompleto ? "PAGO COMPLETADO" : "PAGO PENDIENTE"}
                </div>
                <span className="font-mono text-sm">
                    {pagoCompleto
                        ? "S/ 0.00"
                        : `Faltan S/ ${(total - montoPagado).toFixed(2)}`}
                </span>
            </div>
        </div>
    );
}