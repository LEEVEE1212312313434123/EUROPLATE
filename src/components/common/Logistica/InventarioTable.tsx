import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
}: InventarioTableProps) {
  const [page, setPage] = useState(0);
  const pageSize = 4;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentItems = items.slice(start, end);

  const totalPages = Math.ceil(items.length / pageSize);

   return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">Importación</TableHead>
            <TableHead className="w-[100px]">Container</TableHead>
            <TableHead className="w-[150px]">Purchase Order</TableHead>
            <TableHead className="w-[120px]">Seal</TableHead>
            <TableHead className="w-[200px]">Grade</TableHead>
            <TableHead className="w-[80px]">Type</TableHead>
            <TableHead className="w-[80px]">Width</TableHead>
            <TableHead className="w-[80px]">GSM</TableHead>
            <TableHead className="w-[80px]">L. Metre</TableHead>
            <TableHead className="w-[120px]">Product ID</TableHead>
            <TableHead className="w-[100px]">Peso (Kg)</TableHead>
            <TableHead className="w-[100px]">Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={13} className="text-center py-6">
                No se encontraron productos en inventario.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item) => (
              <TableRow
                key={item.id}
                className="h-14 border-b transition-colors hover:bg-muted/50"
              >
                <TableCell className="truncate max-w-[150px]">{item.importacion}</TableCell>
                <TableCell>{item.container}</TableCell>
                <TableCell className="truncate max-w-[150px]">{item.purchaseOrder}</TableCell>
                <TableCell>{item.seal}</TableCell>
                <TableCell className="truncate max-w-[200px]">{item.grade}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.width}</TableCell>
                <TableCell>{item.gsm}</TableCell>
                <TableCell>{item.lmetre}</TableCell>
                <TableCell>{item.productId}</TableCell>
                <TableCell>{item.grossNetWt.toLocaleString()}</TableCell>
                <TableCell>{item.estado}</TableCell>
                <TableCell className="text-center">
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
            className="rounded-full shadow-sm hover:bg-primary hover:text-white transition cursor-pointer"
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
            className="rounded-full shadow-sm hover:bg-primary hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
