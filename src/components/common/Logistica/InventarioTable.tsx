// src/components/common/Logistica/InventarioTable.tsx

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

export interface InventarioItem {
  id: string;
  importacion: string;
  container: string;
  purchaseOrder: string;
  seal: string;
  grade: string;
  type: string;
  width: number;
  gsm: number;
  lmetre: number;
  productId: string;
  grossNetWt: number;
  estado: "En tránsito" | "En stock" | "Vendido";
}

interface InventarioTableProps {
  items: InventarioItem[];
  onEdit: (item: InventarioItem) => void;
  onDelete: (item: InventarioItem) => void;
}

export function InventarioTable({
  items,
  onEdit,
  onDelete,
}: InventarioTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Importación</TableHead>
          <TableHead>Container</TableHead>
          <TableHead>Purchase Order</TableHead>
          <TableHead>Seal</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Width</TableHead>
          <TableHead>GSM</TableHead>
          <TableHead>L. Metre</TableHead>
          <TableHead>Product ID</TableHead>
          <TableHead>Peso (Kg)</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-center w-[140px]">Acción</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.length === 0 ? (
          <TableRow>
            <TableCell colSpan={13} className="text-center py-6">
              No se encontraron productos en inventario.
            </TableCell>
          </TableRow>
        ) : (
          items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.importacion}</TableCell>
              <TableCell>{item.container}</TableCell>
              <TableCell>{item.purchaseOrder}</TableCell>
              <TableCell>{item.seal}</TableCell>
              <TableCell>{item.grade}</TableCell>
              <TableCell>{item.type}</TableCell>
              <TableCell>{item.width}</TableCell>
              <TableCell>{item.gsm}</TableCell>
              <TableCell>{item.lmetre}</TableCell>
              <TableCell>{item.productId}</TableCell>
              <TableCell>{item.grossNetWt.toLocaleString()}</TableCell>
              <TableCell>{item.estado}</TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(item)}
                    className="text-primary hover:bg-primary/10 cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(item)}
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
