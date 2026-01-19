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
  id?: number;

  importacion?: string;
  container?: string;
  purchaseOrder?: string;
  seal?: string;
  grade?: string;
  type?: string;
  width?: number;
  gsm?: number;
  lmetre?: number;
  productId?: string;
  grossNetWt?: number;

  estado?: "En tránsito" | "En stock" | "Vendido";

  almacen?: string;
  unidad?: string;
  stockActual?: number;
}

interface InventarioTableProps {
  items: InventarioItem[];
  onEdit: (item: InventarioItem) => void;
  onDelete: (item: InventarioItem) => void;
}

export function InventarioTable({ items }: InventarioTableProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentItems = items.slice(start, end);

  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">N° DUA</TableHead>
            <TableHead className="w-[120px]">Product ID</TableHead>
            <TableHead className="w-[120px]">Almacén</TableHead>
            <TableHead className="w-[150px]">Orden de Compra</TableHead>
            <TableHead className="w-[200px]">Descripción del Producto</TableHead>
            <TableHead className="w-[100px]">Stock Actual</TableHead>
            <TableHead className="w-[100px]">Unidad</TableHead>
            <TableHead className="w-[100px]">Estado</TableHead> {/* ✅ Nueva columna */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center py-6">
                No se encontraron productos en inventario.
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item) => (
              <TableRow
                key={item.id}
                className="h-14 border-b transition-colors hover:bg-muted/50"
              >
                <TableCell>{item.importacion}</TableCell>
                <TableCell>{item.productId}</TableCell>
                <TableCell>{item.almacen}</TableCell>
                <TableCell>{item.purchaseOrder}</TableCell>
                <TableCell>{item.grade}</TableCell>
                <TableCell>{item.stockActual ?? 0}</TableCell>
                <TableCell>{item.unidad}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item.estado === "En stock"
                        ? "bg-green-100 text-green-700"
                        : item.estado === "En tránsito"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {item.estado}
                  </span>
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
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, totalPages - 1))
            }
            className="rounded-full shadow-sm hover:bg-primary hover:text-white transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
