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
import { Edit, Trash, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ProductWithRelations } from "@/types/products/product.relations";
import { formatProductName } from "@/utils/formatProductName";
import { toast } from "sonner";

const categoriaDisplayMap: Record<string, string> = {
  Papel: "Papel",
  Cartón: "Cartón",
  Hoja: "Hoja",
  BobinasCarton: "Bobinas de cartón",
};

interface ProductTableProps {
  products: ProductWithRelations[];
  onEdit: (product: ProductWithRelations) => void;
  onDelete: (product: ProductWithRelations) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentProducts = products.slice(start, end);
  const totalPages = Math.ceil(products.length / pageSize);

  const handleEdit = (product: ProductWithRelations) => {
    navigate("/products/editProducts", { state: { product } });
  };

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoria</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-center w-[100px]">Precio Min</TableHead>
            <TableHead className="text-center w-[100px]">Precio Max</TableHead>
            <TableHead className="text-center w-[80px]">Stock Actual</TableHead>
            <TableHead className="text-center w-[80px]">Unidad</TableHead>
            <TableHead className="text-center w-[120px]">Disponibilidad</TableHead>
            <TableHead className="text-center w-[90px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          ) : (
            currentProducts.map((product) => {
              const material = product.materiales?.[0] ?? null;
              const precio = product.precios?.[0] ?? null;
              const almacen = product.almacenes?.[0] ?? null;

              const categoriaLegible =
                categoriaDisplayMap[product.categoria] ?? product.categoria;

              const nombreProducto = formatProductName(product);

              return (
                <TableRow
                  key={product.id}
                  className="h-14 border-b hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{categoriaLegible}</TableCell>
                  <TableCell>{nombreProducto}</TableCell>
                  <TableCell className="text-center">
                    {precio?.precio_min != null
                      ? `$${precio.precio_min.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {precio?.precio_max != null
                      ? `$${precio.precio_max.toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {almacen?.stock_actual ?? 0}
                  </TableCell>
                  <TableCell className="text-center">
                    {material?.unidad_medida ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {!almacen || almacen.stock_actual === 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                        No disponible
                      </span>
                    ) : almacen.stock_actual <= 5 ? (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 flex items-center">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        Pocas
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        Disponible
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (almacen && almacen.stock_actual > 0) {
                            return toast.error(
                              "No puedes eliminar un producto con stock disponible"
                            );
                          }
                          onDelete(product);
                        }}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
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
