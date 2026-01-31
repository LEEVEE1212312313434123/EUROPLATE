import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";

interface NotaDebito {
    id: number;
    serie_correlativo: string;
    motivo: string;
    monto: number;
    fecha_emision: string;
    moneda: string;
    venta_id: number;
}

interface Props {
    data: NotaDebito[];
    onDelete: (nota: NotaDebito) => void;
    onView: (nota: NotaDebito) => void;
}

export function NotasDebitoTable({ data, onView }: Props) {
    return (
        <div className="rounded-md border bg-white shadow-sm">
            <Table>
                <TableHeader className="bg-slate-50">
                    <TableRow>
                        <TableHead className="font-bold">Serie / Correlativo</TableHead>
                        <TableHead className="font-bold">Fecha Emisión</TableHead>
                        <TableHead className="font-bold">Motivo del Cargo</TableHead>
                        <TableHead className="font-bold text-right">Monto Adicional</TableHead>
                        <TableHead className="w-[100px] text-center">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                No hay notas de débito registradas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((nota) => (
                            <TableRow key={nota.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="w-4 h-4 text-blue-500" />
                                        {nota.serie_correlativo}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {new Date(nota.fecha_emision).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="max-w-[200px] truncate">
                                    {nota.motivo}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">
                                        +{nota.moneda} {nota.monto.toFixed(2)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex justify-center gap-1">
                                        {/* Ver Detalle (Abre el Modal con el objeto completo) */}
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