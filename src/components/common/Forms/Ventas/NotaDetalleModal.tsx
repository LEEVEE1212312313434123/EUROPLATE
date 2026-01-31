import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, FileText, User, Receipt } from "lucide-react";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    nota: any | null;
}

export function NotaDetalleModal({ isOpen, onClose, nota }: Props) {
    if (!nota) return null;

    const isNC = nota.tipo === "Nota de Crédito";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Receipt className="w-5 h-5 text-slate-400" />
                        Detalle de {nota.tipo}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Cabecera Principal */}
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-500 uppercase font-bold">Serie / Correlativo</p>
                            <p className="text-lg font-mono font-bold text-slate-900">{nota.serie_correlativo}</p>
                        </div>
                        <div className="text-right space-y-1">
                            <p className="text-xs text-slate-500 uppercase font-bold">Estado</p>
                            <Badge className={isNC ? "bg-rose-500" : "bg-blue-500"}>
                                {nota.tipo}
                            </Badge>
                        </div>
                    </div>

                    {/* Información de la Venta y Cliente */}
                    <div className="grid grid-cols-2 gap-6 px-1">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <User className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Cliente:</span>
                                <span className="font-semibold">{nota.cliente_nombre || "Consumidor Final"}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Fecha Emisión:</span>
                                <span>{new Date(nota.fecha_emision).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <FileText className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-600">Venta Origen:</span>
                                <span className="font-semibold underline decoration-slate-300">#{nota.venta_id}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-bold">
                                <span className="text-slate-600 uppercase text-xs">Monto Ajustado:</span>
                                <span className={isNC ? "text-rose-600" : "text-blue-600"}>
                                    {nota.moneda} {nota.monto.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Motivo */}
                    <div className="px-1">
                        <p className="text-xs text-slate-500 uppercase font-bold mb-1">Motivo / Sustento</p>
                        <p className="text-sm text-slate-700 italic bg-slate-50 p-3 rounded border-l-4 border-slate-300">
                            "{nota.motivo}"
                        </p>
                    </div>

                    {/* Detalles de Productos (Solo si hay detalles) */}
                    {nota.detalles && nota.detalles.length > 0 && (
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 uppercase font-bold px-1">Items Afectados</p>
                            <div className="border rounded-md overflow-hidden">
                                <Table>
                                    <TableHeader className="bg-slate-50">
                                        <TableRow>
                                            <TableHead className="text-xs">Producto</TableHead>
                                            <TableHead className="text-xs text-center">Cant.</TableHead>
                                            <TableHead className="text-xs text-right">Precio</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {nota.detalles.map((det: any, i: number) => (
                                            <TableRow key={i}>
                                                <TableCell className="text-xs font-medium">Prod. ID: {det.producto_id}</TableCell>
                                                <TableCell className="text-xs text-center">{det.cantidad}</TableCell>
                                                <TableCell className="text-xs text-right">{nota.moneda} {det.precio_unitario?.toFixed(2)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}