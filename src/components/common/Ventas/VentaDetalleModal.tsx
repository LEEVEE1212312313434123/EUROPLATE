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
    ArrowDownCircle,
    ArrowUpCircle,
    Wallet,
    Info,
    ChevronRight
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-90xl max-h-[95vh] overflow-hidden p-0 shadow-2xl border-none bg-white">
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
                                        Venta #{ventaId}
                                    </DialogTitle>
                                    <DialogDescription className="text-slate-500 font-medium">
                                        Trazabilidad completa de la operación
                                    </DialogDescription>
                                </div>
                            </div>
                        </DialogHeader>
                        <div className="flex items-center gap-3">
                            {venta && <BtnVerPDF venta={venta} />}
                        </div>
                    </div>
                </div>

                <div className="overflow-y-auto px-6 py-6 max-h-[80vh] space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="animate-spin h-10 w-10 text-slate-400" />
                            <p className="text-sm font-medium text-muted-foreground">Sincronizando datos...</p>
                        </div>
                    ) : venta ? (
                        <>
                            {/* INFO CARDS SIEMPRE DE 2 EN 2 (2x2) */}
                            <div className="grid grid-cols-2 gap-4 items-stretch">
                                <InfoCard
                                    icon={<User className="w-3.5 h-3.5" />}
                                    label="Cliente"
                                    value={venta.cliente?.nombre || "Consumidor Final"}
                                />
                                <InfoCard
                                    icon={<Calendar className="w-3.5 h-3.5" />}
                                    label="Fecha"
                                    value={new Date(venta.fecha_venta).toLocaleDateString()}
                                />
                                <InfoCard
                                    icon={<Tag className="w-3.5 h-3.5" />}
                                    label="Comprobante"
                                    value={
                                        <Badge variant="outline" className="font-bold border-slate-200 py-0.5 h-auto text-center inline-flex">
                                            {venta.tipo_comprobante}
                                        </Badge>
                                    }
                                />
                                <InfoCard
                                    icon={<Wallet className="w-3.5 h-3.5" />}
                                    label="Estado"
                                    value={
                                        <Badge className="bg-emerald-500 hover:bg-emerald-600 border-none uppercase text-[10px] py-0.5 h-auto inline-flex">
                                            {venta.estado}
                                        </Badge>
                                    }
                                />
                            </div>

                            {/* TABLA DE PRODUCTOS */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <ChevronRight className="w-4 h-4 text-primary" />
                                        Artículos Vendidos
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{venta.venta_productos?.length || 0} Items</span>
                                </div>
                                <div className="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm">
                                    <Table>
                                        <TableHeader className="bg-slate-50/50">
                                            <TableRow>
                                                <TableHead className="w-[45%] font-bold text-slate-600">Descripción</TableHead>
                                                <TableHead className="text-center font-bold text-slate-600">Original</TableHead>
                                                <TableHead className="text-center font-bold text-slate-600">Devuelto</TableHead>
                                                <TableHead className="text-center font-bold text-primary">Final</TableHead>
                                                <TableHead className="text-right font-bold text-slate-600">Subtotal</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {venta.venta_productos?.map((item: any) => (
                                                <TableRow key={item.id} className="hover:bg-slate-50/30">
                                                    <TableCell className="font-semibold text-slate-700">{item.producto?.nombre_producto}</TableCell>
                                                    <TableCell className="text-center font-medium">{item.cantidadOriginal}</TableCell>
                                                    <TableCell className="text-center">
                                                        {item.cantidadYaDevuelta > 0 ? (
                                                            <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded text-xs">-{item.cantidadYaDevuelta}</span>
                                                        ) : <span className="text-slate-300">-</span>}
                                                    </TableCell>
                                                    <TableCell className="text-center font-black text-slate-900">{item.cantidadDisponible}</TableCell>
                                                    <TableCell className="text-right font-bold text-slate-800">{venta.moneda} {item.subtotal.toFixed(2)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </section>

                            {/* SECCIÓN DE AJUSTES */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AdjustmentList
                                    title="Notas de Crédito"
                                    icon={<ArrowDownCircle className="w-5 h-5" />}
                                    data={venta.notasCredito || []}
                                    colorClass="text-rose-600"
                                    bgClass="bg-rose-50/50"
                                    moneda={venta.moneda}
                                    isNegative
                                />
                                <AdjustmentList
                                    title="Notas de Débito"
                                    icon={<ArrowUpCircle className="w-5 h-5" />}
                                    data={venta.notasDebito || []}
                                    colorClass="text-blue-600"
                                    bgClass="bg-blue-50/50"
                                    moneda={venta.moneda}
                                />
                            </div>

                            {/* FOOTER CORREGIDO - MAPEADO SEGÚN TU JSON */}
                            <div className="mt-8 mb-8 border border-slate-200 rounded-2xl bg-white shadow-sm overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-2">
                                    <div className="p-6 border-r border-slate-100 space-y-3 bg-slate-50/30">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-500 font-medium">Monto Bruto Original</span>
                                            <span className="font-bold text-slate-900">{venta.moneda} {Number(venta.totalOriginal || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-rose-500 flex items-center gap-1 font-medium">
                                                <ArrowDownCircle className="w-3.5 h-3.5" /> Total Notas Crédito
                                            </span>
                                            <span className="font-bold text-rose-600">-{venta.moneda} {Number(venta.totalNotasCredito || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-blue-500 flex items-center gap-1 font-medium">
                                                <ArrowUpCircle className="w-3.5 h-3.5" /> Total Notas Débito
                                            </span>
                                            <span className="font-bold text-blue-600">+{venta.moneda} {Number(venta.totalNotasDebito || 0).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col items-center md:items-end justify-center bg-white">
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-1">Saldo Neto Final</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-xl font-light text-slate-400">{venta.moneda}</span>
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter tabular-nums">
                                                {Number(venta.totalAjustado || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-full">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-emerald-700 uppercase">Documento Liquidado</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center py-20">
                            <Info className="h-10 w-10 text-slate-200 mb-2" />
                            <p className="text-slate-400 text-sm">No se encontró información.</p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function InfoCard({ icon, label, value }: any) {
    return (
        <div className="flex flex-col p-3 md:p-4 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-200 transition-all h-full min-w-0 overflow-hidden">
            {/* Label e Icono */}
            <div className="flex items-center gap-2 text-slate-400 mb-1.5">
                <div className="flex-shrink-0">{icon}</div>
                <span className="text-[8px] md:text-[9px] uppercase font-black tracking-widest leading-none whitespace-nowrap">
                    {label}
                </span>
            </div>
            {/* Valor */}
            <div className="flex items-center min-h-[1.5rem] md:min-h-[2rem]">
                <div className="text-xs md:text-sm font-bold text-slate-800 w-full break-words line-clamp-2 leading-tight">
                    {value}
                </div>
            </div>
        </div>
    );
}

function AdjustmentList({ title, icon, data, colorClass, bgClass, moneda, isNegative }: any) {
    return (
        <div className={`p-5 rounded-2xl border border-slate-100 ${bgClass}`}>
            <div className={`flex items-center gap-2 mb-4 ${colorClass}`}>
                {icon}
                <h4 className="font-black text-xs uppercase tracking-widest">{title}</h4>
            </div>
            <div className="space-y-2">
                {data.length > 0 ? (
                    data.map((nota: any) => (
                        <div key={nota.id} className="flex justify-between items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                            <div className="text-xs">
                                <p className="font-bold text-slate-800">{nota.serie_correlativo}</p>
                                <p className="text-slate-400 text-[10px] truncate max-w-[150px]">{nota.motivo}</p>
                            </div>
                            <p className={`text-sm font-black ${colorClass}`}>
                                {isNegative ? '-' : '+'}{moneda} {Number(nota.monto || 0).toFixed(2)}
                            </p>
                        </div>
                    ))
                ) : <p className="text-[10px] text-slate-400 italic font-medium">Sin movimientos</p>}
            </div>
        </div>
    );
}