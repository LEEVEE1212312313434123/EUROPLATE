// @/components/common/Ventas/NotasCreditoTable.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash, ArrowDownCircle, ReceiptText } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NotasCreditoTableProps {
    data: any[];
    onView: (nota: any) => void;
    onDelete: (nota: any) => void;
}

export function NotasCreditoTable({ data, onView, onDelete }: NotasCreditoTableProps) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50">
                        <TableHead className="font-bold w-[100px] text-slate-600">ID Venta</TableHead>
                        <TableHead className="font-bold text-slate-600">N° Nota</TableHead>
                        <TableHead className="font-bold text-slate-600">Fecha</TableHead>
                        <TableHead className="font-bold text-slate-600">Cliente</TableHead>
                        <TableHead className="font-bold text-slate-600">Motivo</TableHead>
                        <TableHead className="font-bold text-slate-600">Monto NC</TableHead>
                        <TableHead className="text-right font-bold text-slate-600">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((nota) => (
                            <TableRow key={nota.id} className="hover:bg-slate-50/30 transition-colors">
                                {/* ID de la Venta Relacionada */}
                                <TableCell className="font-bold text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <ReceiptText className="w-3 h-3" />
                                        #{nota.venta_id || '---'}
                                    </div>
                                </TableCell>

                                {/* Serie y Correlativo de la Nota */}
                                <TableCell className="font-bold text-rose-600">
                                    {nota.serie_correlativo}
                                </TableCell>

                                <TableCell className="whitespace-nowrap text-slate-600">
                                    {new Date(nota.fecha_emision).toLocaleDateString()}
                                </TableCell>

                                <TableCell className="font-semibold text-slate-700">
                                    {nota.cliente?.nombre || nota.cliente_nombre || "Cliente General"}
                                </TableCell>

                                <TableCell>
                                    <Badge variant="outline" className="text-[10px] font-medium border-slate-200 bg-slate-50 text-slate-500 uppercase">
                                        {nota.motivo || "Devolución"}
                                    </Badge>
                                </TableCell>

                                {/* MONTO DE LA NOTA (Columna Agregada) */}
                                <TableCell className="font-black text-rose-600">
                                    <div className="flex items-center gap-1">
                                        <ArrowDownCircle className="w-3.5 h-3.5" />
                                        {nota.moneda} {Number(nota.monto || 0).toFixed(2)}
                                    </div>
                                </TableCell>

                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-slate-600 hover:text-primary hover:bg-primary/5"
                                            onClick={() => onView(nota)}
                                            title="Ver detalle de nota"
                                        >
                                            <Eye className="h-4.5 w-4.5" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-9 w-9 text-slate-400 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => onDelete(nota)}
                                            title="Anular Nota"
                                        >
                                            <Trash className="h-4.5 w-4.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={7} className="h-32 text-center text-slate-400 italic">
                                No se encontraron notas de crédito registradas.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}