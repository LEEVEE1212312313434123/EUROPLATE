// @/components/common/Ventas/VentasTable.tsx
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash, RefreshCw, FileText, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { VentasService } from "@/services/ventas/venta.service";
import { Badge } from "@/components/ui/badge";

interface VentasTableProps {
  onView: (venta: any) => void;
  onDelete: (venta: any) => void;
  onEmitNote: (venta: any) => void;
}

export function VentasTable({ onView, onDelete, onEmitNote }: VentasTableProps) {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await VentasService.getVentasParaTabla();
      setVentas(data);
    } catch (error) {
      console.error("Error cargando ventas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-32">
      <RefreshCw className="animate-spin mr-2" /> Cargando ventas...
    </div>
  );

  return (
    <div className="rounded-md border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-bold w-[80px]">ID</TableHead>
            <TableHead className="font-bold">Fecha</TableHead>
            <TableHead className="font-bold">Cliente</TableHead>
            <TableHead className="font-bold text-center">N. Crédito</TableHead>
            <TableHead className="font-bold text-center">N. Débito</TableHead>
            <TableHead className="font-bold">Total</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="text-right font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.map((venta) => (
            <TableRow key={venta.id} className="hover:bg-slate-50/50 transition-colors">
              <TableCell className="font-medium text-primary">#{venta.id}</TableCell>
              <TableCell className="whitespace-nowrap">{venta.fecha}</TableCell>
              <TableCell className="font-semibold">{venta.cliente}</TableCell>

              {/* Columna Notas de Crédito */}
              <TableCell className="text-center">
                {venta.conteoNotasCredito > 0 ? (
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
                    <ArrowDownCircle className="w-3 h-3" />
                    {venta.conteoNotasCredito}
                  </Badge>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </TableCell>

              {/* Columna Notas de Débito */}
              <TableCell className="text-center">
                {venta.conteoNotasDebito > 0 ? (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 gap-1">
                    <ArrowUpCircle className="w-3 h-3" />
                    {venta.conteoNotasDebito}
                  </Badge>
                ) : (
                  <span className="text-slate-300">-</span>
                )}
              </TableCell>

              <TableCell className="font-bold whitespace-nowrap">{venta.total}</TableCell>

              <TableCell>
                <Badge variant={venta.estado === "Completado" ? "default" : "secondary"}>
                  {venta.estado}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-50"
                    onClick={() => onEmitNote(venta)}
                    title="Emitir Nota"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0"
                    onClick={() => onView(venta)}
                    title="Ver detalle"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 hover:text-red-600"
                    onClick={() => onDelete(venta)}
                    title="Eliminar"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}