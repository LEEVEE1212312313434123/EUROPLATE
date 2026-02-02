// @/components/common/Ventas/VentasTable.tsx
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Trash, RefreshCw, FilePlus2 } from "lucide-react";
import { VentasService } from "@/services/ventas/venta.service";
import { Badge } from "@/components/ui/badge";

interface VentasTableProps {
  onView?: (venta: any) => void;
  onDelete?: (venta: any) => void;
  onEmitirNota?: (venta: any) => void;
  // Nuevos controladores booleanos
  showView?: boolean;
  showDelete?: boolean;
  showEmitirNota?: boolean;
}

export function VentasTable({
  onView,
  onDelete,
  onEmitirNota,
  showView = false,      // Por defecto ocultos si no se pasan
  showDelete = false,
  showEmitirNota = false
}: VentasTableProps) {
  const [ventas, setVentas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Determinar si debemos mostrar la columna de acciones basada en los booleanos
  const mostrarAcciones = showView || showDelete || showEmitirNota;

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
      <RefreshCw className="animate-spin mr-2 text-primary" />
      <span className="text-sm font-medium text-slate-500">Cargando ventas...</span>
    </div>
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50/50">
            <TableHead className="font-bold w-[100px] text-slate-600">ID</TableHead>
            <TableHead className="font-bold text-slate-600">Fecha</TableHead>
            <TableHead className="font-bold text-slate-600">Cliente</TableHead>
            <TableHead className="font-bold text-slate-600">Total Bruto</TableHead>
            <TableHead className="font-bold text-slate-600">Estado</TableHead>
            {mostrarAcciones && <TableHead className="text-right font-bold text-slate-600">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {ventas.length > 0 ? (
            ventas.map((venta) => (
              <TableRow key={venta.id} className="hover:bg-slate-50/30 transition-colors">
                <TableCell className="font-bold text-primary">#{venta.id}</TableCell>
                <TableCell className="whitespace-nowrap text-slate-600">{venta.fecha}</TableCell>
                <TableCell className="font-semibold text-slate-700">{venta.cliente}</TableCell>
                <TableCell className="font-black text-slate-900">{venta.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={venta.estado === "Completado" ? "default" : "secondary"}
                    className={venta.estado === "Completado" ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                  >
                    {venta.estado}
                  </Badge>
                </TableCell>

                {mostrarAcciones && (
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {showEmitirNota && onEmitirNota && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                          onClick={() => onEmitirNota(venta)}
                          title="Emitir Nota"
                        >
                          <FilePlus2 className="h-4 w-4" />
                        </Button>
                      )}

                      {showView && onView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onView(venta)}
                          title="Ver detalle"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}

                      {showDelete && onDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50"
                          onClick={() => onDelete(venta)}
                          title="Eliminar"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={mostrarAcciones ? 6 : 5} className="h-24 text-center text-slate-400 italic">
                No hay ventas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}