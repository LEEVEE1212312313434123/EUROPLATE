// @/components/common/Forms/Ventas/NotaDetalleModal.tsx
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { User, Receipt, Package, Info, Loader2 } from "lucide-react";
import { VentasService } from "@/services/ventas/venta.service";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    nota: any | null;
}

export function NotaDetalleModal({ isOpen, onClose, nota }: Props) {
    const [ventaOriginal, setVentaOriginal] = useState<any>(null);
    const [loadingVenta, setLoadingVenta] = useState(false);

    useEffect(() => {
        if (isOpen && nota?.venta_id) {
            setLoadingVenta(true);
            VentasService.getVentaById(nota.venta_id)
                .then(setVentaOriginal)
                .catch(console.error)
                .finally(() => setLoadingVenta(false));
        } else {
            setVentaOriginal(null);
        }
    }, [isOpen, nota?.venta_id]);

    if (!nota) return null;

    const isNC = nota.tipo === "Nota de Crédito" || nota.serie_correlativo?.startsWith('NC');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl border-b pb-2">
                        <Receipt className={`w-5 h-5 ${isNC ? "text-rose-500" : "text-blue-500"}`} />
                        Detalle de {nota.tipo || 'Documento'}: {nota.serie_correlativo}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* SECCIÓN: CABECERA Y CLIENTE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border ${isNC ? "bg-rose-50/50 border-rose-100" : "bg-blue-50/50 border-blue-100"}`}>
                            <p className="text-[10px] uppercase font-black text-slate-500 mb-2">Información del Comprobante</p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Fecha Emisión:</span>
                                    <span className="font-bold">{new Date(nota.fecha_emision).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-600">Monto Ajuste:</span>
                                    <span className={`font-black ${isNC ? "text-rose-600" : "text-blue-600"}`}>
                                        {nota.moneda} {nota.monto?.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                            <p className="text-[10px] uppercase font-black text-slate-500 mb-2">Datos del Cliente</p>
                            <div className="flex items-center gap-3">
                                <User className="w-8 h-8 text-slate-400 bg-white p-1.5 rounded-full border" />
                                <div>
                                    <p className="text-sm font-bold text-slate-900">{nota.cliente_nombre || "Cliente General"}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Referencia Venta: #{nota.venta_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECCIÓN: VENTA ORIGINAL (PRODUCTOS) */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-sm uppercase">
                                <Package className="w-4 h-4 text-primary" />
                                Detalle de Venta Original
                            </h3>
                            {loadingVenta && <Loader2 className="w-4 h-4 animate-spin text-slate-400" />}
                        </div>

                        <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-slate-50">
                                    <TableRow>
                                        <TableHead className="font-bold text-xs">Producto</TableHead>
                                        <TableHead className="text-center font-bold text-xs">Cant.</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Precio Unit.</TableHead>
                                        <TableHead className="text-right font-bold text-xs">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ventaOriginal?.venta_productos?.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="text-sm font-medium">{item.producto?.nombre_producto}</TableCell>
                                            <TableCell className="text-center text-sm">{item.cantidadOriginal}</TableCell>
                                            <TableCell className="text-right text-sm">
                                                {nota.moneda} {(item.subtotal / item.cantidadOriginal).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-sm">
                                                {nota.moneda} {item.subtotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {/* SECCIÓN DE AJUSTE (EL "AGREGADO ABAJO") */}
                                    <TableRow className={isNC ? "bg-rose-50/50" : "bg-blue-50/50"}>
                                        <TableCell colSpan={3} className="text-right font-bold py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs uppercase text-slate-500">Ajuste Aplicado:</span>
                                                <span className="text-sm">{nota.motivo}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className={`text-right font-black text-lg ${isNC ? "text-rose-600" : "text-blue-600"}`}>
                                            {isNC ? "-" : "+"}{nota.moneda} {nota.monto?.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* MOTIVO DETALLADO */}
                    <div className="bg-slate-50 p-4 rounded-lg border border-dashed border-slate-300">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 flex items-center gap-2">
                            <Info className="w-3 h-3" /> Sustento del Documento
                        </p>
                        <p className="text-sm text-slate-700 italic">
                            "{nota.motivo || 'No se especificó un motivo detallado'}"
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}