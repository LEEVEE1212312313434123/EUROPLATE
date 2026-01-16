import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

type VentaUI = {
  id: number;
  fecha: string;
  estado: "Pagada" | "Pendiente" | "Anulada";
  cliente: string;
  total: number;
};

const ventasMock: VentaUI[] = [
  { id: 1001, fecha: "2026-01-10", estado: "Pagada", cliente: "Juan Pérez", total: 120 },
  { id: 1002, fecha: "2026-01-11", estado: "Pendiente", cliente: "María López", total: 340 },
  { id: 1003, fecha: "2026-01-12", estado: "Anulada", cliente: "Carlos Ramos", total: 89 },
];

interface VentaTableProps {
  onEdit: (venta: VentaUI) => void;
  onDelete: (venta: VentaUI) => void;
}

export function VentaTable({ onEdit, onDelete }: VentaTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentVentas = ventasMock.slice(start, end);
  const totalPages = Math.ceil(ventasMock.length / pageSize);

  const handleEdit = (venta: VentaUI) => {
    navigate("/ventas/edit", { state: { venta } });
  };

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">ID Venta</TableHead>
            <TableHead className="text-center w-[140px]">Fecha</TableHead>
            <TableHead className="text-center w-[120px]">Estado</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-center w-[120px]">Total (S/)</TableHead>
            <TableHead className="text-center w-[90px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentVentas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No se encontraron ventas.
              </TableCell>
            </TableRow>
          ) : (
            currentVentas.map((venta) => (
              <TableRow
                key={venta.id}
                className="h-14 border-b hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-center font-medium">
                  {venta.id}
                </TableCell>
                <TableCell className="text-center">
                  {venta.fecha}
                </TableCell>
                <TableCell className="flex justify-center">
                  {venta.estado === "Pagada" ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Pagada
                    </span>
                  ) : venta.estado === "Pendiente" ? (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                      Pendiente
                    </span>
                  ) : (
                    <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Anulada
                    </span>
                  )}
                </TableCell>
                <TableCell>{venta.cliente}</TableCell>
                <TableCell className="text-center font-semibold">
                  S/ {venta.total.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(venta)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(venta)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-2">
          <Button
            variant="outline"
            size="icon"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="rounded-full shadow-sm hover:bg-primary hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <span className="text-sm text-muted-foreground">
            Página {page + 1} de {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
            className="rounded-full shadow-sm hover:bg-primary hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
