import { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal, RefreshCw } from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-bold">ID</TableHead>
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
              <TableRow key={venta.id} className="hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium text-primary">#{venta.id}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell className="font-semibold">{venta.cliente}</TableCell>
                <TableCell>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Opciones</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(venta)} className="cursor-pointer">
                        <Edit className="mr-2 h-4 w-4" /> Ver/Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 cursor-pointer"
                        onClick={() => onDelete(venta)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}