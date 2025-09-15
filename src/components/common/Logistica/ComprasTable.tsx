import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Eye } from "lucide-react";
import type { Compra } from "@/types/logistica.types";

interface ComprasTableProps {
  compras: Compra[];
  onEdit: (compra: Compra) => void;
  onDelete: (compra: Compra) => void;
  onView?: (compra: Compra) => void;
}

export function ComprasTable({
  compras,
  onEdit,
  onDelete,
  onView,
}: ComprasTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Importación</TableHead>
          <TableHead>Descripción</TableHead>
          <TableHead>Proveedor</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead>Destino</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center w-[140px]">
            Fecha Entrega
          </TableHead>
          <TableHead className="text-center w-[140px]">Acción</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {compras.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-6">
              No se encontraron compras registradas.
            </TableCell>
          </TableRow>
        ) : (
          compras.map((c) => (
            <TableRow key={c.importacion_id}>
              <TableCell>{c.importacion_id}</TableCell>
              <TableCell>{c.descripcion}</TableCell>
              <TableCell>{c.proveedor.nombre}</TableCell>
              <TableCell>{c.logistica.origen}</TableCell>
              <TableCell>{c.logistica.destino}</TableCell>
              <TableCell>{c.logistica.estado}</TableCell>
              <TableCell className="text-center">
                {c.logistica.fecha_entrega}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView && onView(c)}
                    className="text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(c)}
                    className="text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(c)}
                    className="text-primary hover:bg-primary/10 cursor-pointer"
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
  );
}
