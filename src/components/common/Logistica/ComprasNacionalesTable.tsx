import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash, PackageCheck } from "lucide-react";

export interface CompraNacionalRow {
    id: number;
    proveedor: string;
    serie: string;
    correlativo: number;
    total: number;
    estado: string;
    fecha_emision: string;
}

interface Props {
    compras: CompraNacionalRow[];
    onView: (id: number) => void;
    onDelete: (row: CompraNacionalRow) => void;
    onEntregar: (id: number) => void;
}

export function ComprasNacionalesTable({
    compras,
    onView,
    onDelete,
    onEntregar,
}: Props) {
    const renderEstado = (estado: string) => {
        switch (estado) {
            case "Registrado":
                return <span className="text-blue-500">Registrado</span>;
            case "Pagado":
                return <span className="text-purple-500">Pagado</span>;
            case "Entregado":
                return <span className="text-green-600">Entregado</span>;
            case "Anulado":
                return <span className="text-red-500">Anulado</span>;
            default:
                return estado;
        }
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Proveedor</TableHead>
                    <TableHead>Comprobante</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
            </TableHeader>

            <TableBody>
                {compras.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                            No hay compras nacionales registradas
                        </TableCell>
                    </TableRow>
                ) : (
                    compras.map((c) => (
                        <TableRow key={c.id}>
                            <TableCell>{c.id}</TableCell>
                            <TableCell>{c.proveedor}</TableCell>
                            <TableCell>
                                {c.serie}-{String(c.correlativo).padStart(8, "0")}
                            </TableCell>
                            <TableCell>$ {c.total.toFixed(2)}</TableCell>
                            <TableCell>{c.fecha_emision}</TableCell>
                            <TableCell>{renderEstado(c.estado)}</TableCell>

                            <TableCell className="text-center">
                                <div className="flex justify-center gap-1">
                                    <Button size="icon" variant="ghost" onClick={() => onView(c.id)}>
                                        <Eye className="w-4 h-4" />
                                    </Button>

                                    {c.estado !== "Entregado" && c.estado !== "Anulado" && (
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => onEntregar(c.id)}
                                        >
                                            <PackageCheck className="w-4 h-4 text-green-600" />
                                        </Button>
                                    )}

                                    <Button
                                        size="icon"
                                        variant="ghost"
                                        onClick={() => onDelete(c)}
                                    >
                                        <Trash className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))
                )}
            </TableBody>
        </Table>
    );
}
