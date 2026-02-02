// @/components/common/Ventas/VentaDetalleModal.tsx
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { VentasService } from "@/services/ventas/venta.service";
import { Badge } from "@/components/ui/badge";
import {
    Loader2,
    Receipt,
    User,
    Calendar,
    Tag,
    Wallet,
    Info,
    Package
} from "lucide-react";
import { BtnVerPDF } from "@/components/common/Ventas/BtnVerPDF";

interface Props {
    ventaId: number | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VentaDetalleModal({ ventaId, open, onOpenChange }: Props) {
    const [loading, setLoading] = useState(false);
    const [venta, setVenta] = useState<any>(null);

    useEffect(() => {
        if (open && ventaId) {
            setLoading(true);
            VentasService.getVentaById(ventaId)
                .then(setVenta)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [open, ventaId]);

    // Cálculos basados en el total de la venta
    const calcularTotales = () => {
        if (!venta) return { subtotal: 0, igv: 0, total: 0 };
        const total = Number(venta.totalOriginal || 0);
        const subtotal = total / 1.18;
        const igv = total - subtotal;
        return { subtotal, igv, total };
    };

    const { subtotal, igv, total } = calcularTotales();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 shadow-2xl border-none bg-white">
                {/* HEADER */}
                <div className="p-6 border-b bg-white sticky top-0 z-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <DialogHeader>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 rounded-lg">
                                    <Receipt className="h-6 w-6 text-slate-600" />
                                </div>
                                <div>
                                    <DialogTitle className="text-2xl font-black tracking-tight text-slate-900">
                                        Detalle de Venta #{ventaId}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        Información original del comprobante emitido
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex items-center gap-3">
                            {venta && <BtnVerPDF venta={venta} />}
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto px-6 py-6 max-h-[75vh] space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin h-10 w-10 text-slate-400" />
                            <p className="text-sm font-medium text-muted-foreground">Cargando comprobante...</p>
                        </div>
                    ) : venta ? (
                        <>
                            {/* INFO CARDS (2x2) */}
                            <div className="grid grid-cols-2 gap-4 items-stretch">
                                <InfoCard
                                    icon={<User className="w-3.5 h-3.5" />}
                                    label="Cliente"
                                    value={venta.cliente?.nombre || "Consumidor Final"}
                                />
                                <InfoCard
                                    icon={<Calendar className="w-3.5 h-3.5" />}
                                    label="Fecha de Emisión"
                                    value={new Date(venta.fecha_venta).toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' })}
                                />
                                <InfoCard
                                    icon={<Tag className="w-3.5 h-3.5" />}
                                    label="Tipo de Comprobante"
                                    value={
                                        <Badge variant="outline" className="font-bold border-slate-200 py-0.5 h-auto text-center">
                                            {venta.tipo_comprobante}
                                        </Badge>
                                    }
                                />
                                <InfoCard
                                    icon={<Wallet className="w-3.5 h-3.5" />}
                                    label="Estado de Pago"
                                    value={
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none uppercase text-[10px] py-0.5 h-auto">
                                            {venta.estado}
                                        </Badge>
                                    }
                                />
                            </div>

                            {/* TABLA DE PRODUCTOS ORIGINALES */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <Package className="w-4 h-4 text-primary" />
                                        Artículos en este Comprobante
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{venta.venta_productos?.length || 0} Items</span>
                                </div>
                                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow>
                                                <TableHead className="w-[50%] font-bold text-slate-600">Descripción</TableHead>
                                                <TableHead className="text-center font-bold text-slate-600">Cantidad</TableHead>
                                                <TableHead className="text-right font-bold text-slate-600">Precio Unit.</TableHead>
                                                <TableHead className="text-right font-bold text-slate-600">Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {venta.venta_productos?.map((item: any) => (
                                                <TableRow key={item.id} className="hover:bg-slate-50/30">
                                                    <TableCell className="font-semibold text-slate-700">
                                                        {item.producto?.nombre_producto}
                                                    </TableCell>
                                                    <TableCell className="text-center font-black text-slate-900">
                                                        {item.cantidadOriginal}
                                                    </TableCell>
                                                    <TableCell className="text-right text-slate-600 font-medium">
                                                        {venta.moneda} {(item.subtotal / item.cantidadOriginal).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell className="text-right font-bold text-slate-800">
                                                        {venta.moneda} {item.subtotal.toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </section>

                            {/* FOOTER - RESUMEN DE TOTALES E IGV */}
                            <div className="mt-8 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    {/* Desglose Fiscal */}
                                    <div className="p-6 border-r border-slate-100 space-y-3 bg-slate-50/30">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Subtotal (Base Imponible)</span>
                                            <span className="font-bold text-slate-900">{venta.moneda} {subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">IGV (18%)</span>
                                            <span className="font-bold text-slate-900">{venta.moneda} {igv.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {/* Monto Final */}
                                    <div className="p-6 flex flex-col items-center md:items-end justify-center bg-white">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Total Comprobante</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-light text-slate-400">{venta.moneda}</span>
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                                                {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-20">
                            <Info className="h-10 w-10 text-slate-200 mb-2" />
                            <p className="text-slate-400 text-sm">No se encontró información de la venta.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoCard({ icon, label, value }: any) {
    return (
        <div className="flex flex-col p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-all min-w-0">
            <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                <div className="flex-shrink-0">{icon}</div>
                <span className="text-[9px] uppercase font-black tracking-widest leading-none">
                    {label}
                </span>
            </div>
            <div className="text-sm font-bold text-slate-800 break-words line-clamp-2">
                {value}
            </div>
        </div>
    );
}