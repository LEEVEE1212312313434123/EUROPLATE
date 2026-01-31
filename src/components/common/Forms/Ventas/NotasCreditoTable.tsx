import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Info } from "lucide-react";

interface Props {
    data: any[];
    onDelete: (nota: any) => void;
    onView: (nota: any) => void; // Aquí se pasa el objeto completo
}

export function NotasCreditoTable({ data, onView }: Props) {
    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold">Serie / Correlativo</TableHead>
                        <TableHead className="font-bold">Fecha Emisión</TableHead>
                        <TableHead className="font-bold">Motivo</TableHead>
                        <TableHead className="font-bold text-right">Monto</TableHead>
                        <TableHead className="w-[100px] text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No hay notas de crédito registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((nota) => (
                            <TableRow key={nota.id} className="hover:bg-slate-50/50">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <Info className="w-4 h-4 text-slate-400" />
                                        {nota.serie_correlativo}
                                    </div>
                                </TableCell>
                                <TableCell>{new Date(nota.fecha_emision).toLocaleDateString()}</TableCell>
                                <TableCell className="max-w-[200px] truncate">{nota.motivo}</TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className="text-rose-600 border-rose-200 bg-rose-50">
                                        {nota.moneda} {nota.monto.toFixed(2)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 p-0"
                                            onClick={() => onView(nota)}
                                            title="Ver detalle"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}