import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash, RefreshCw } from "lucide-react"; // Cambié Edit por Eye para "Ver"
import { VentasService } from "@/services/ventas/venta.service";
import { Badge } from "@/components/ui/badge";

interface VentasTableProps {
  onEdit: (venta: any) => void;
  onDelete: (venta: any) => void;
}

export function VentasTable({ onEdit, onDelete }: VentasTableProps) {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const data = await VentasService.getVentasParaTabla();
      setVentas(data);
    } catch (error) {
      console.error("Error:", error);
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
            <TableHead className="font-bold">Método Pago</TableHead>
            <TableHead className="font-bold">Total</TableHead>
            <TableHead className="font-bold">Estado</TableHead>
            <TableHead className="text-right font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                No se encontraron ventas.
              </TableCell>
            </TableRow>
          ) : (
            ventas.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-primary">#{venta.id}</TableCell>
                <TableCell className="whitespace-nowrap">{venta.fecha}</TableCell>
                <TableCell className="font-semibold">{venta.cliente}</TableCell>
                <TableCell>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {venta.tipoPago}
                  </span>
                </TableCell>
                <TableCell className="font-bold">{venta.total}</TableCell>
                <TableCell>
                  <Badge variant={venta.estado === "Completado" ? "default" : "secondary"}>
                    {venta.estado}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => onEdit(venta)}
                      title="Ver detalle"
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0"
                      onClick={() => onDelete(venta)}
                      title="Eliminar"
                    >
                      <Trash />
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