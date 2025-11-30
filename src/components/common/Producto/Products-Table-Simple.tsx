import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Product } from "@/types/product.types";
import { formatProductName } from "@/utils/formatProductName";

const categoriaDisplayMap: Record<string, string> = {
  Papel: "Papel",
  Cartón: "Cartón",
  Hoja: "Hoja",
  BobinasCarton: "Bobinas de cartón",
};

interface ProductTableSimpleProps {
  products: Product[];
  onDelete: (product: Product) => void;
  onRestore?: (product: Product) => void;
}

export function ProductTableSimple({ products, onDelete, onRestore }: ProductTableSimpleProps) {
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentProducts = products.slice(start, end);
  const totalPages = Math.ceil(products.length / pageSize);

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Categoria</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-center w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-6">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          ) : (
            currentProducts.map((product) => {
              const categoriaLegible = categoriaDisplayMap[product.categoria] ?? product.categoria;
              const nombreProducto = formatProductName(product);

              return (
                <TableRow key={product.id} className="h-14 border-b hover:bg-muted/50 transition-colors">
                  <TableCell>{categoriaLegible}</TableCell>
                  <TableCell>{nombreProducto}</TableCell>

                  <TableCell className="text-center">
                    <div className="flex justify-center gap-1">
                      {onRestore && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onRestore(product)}
                          className="text-green-600 hover:bg-green-100 cursor-pointer"
                          title="Restaurar producto"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product)}
                        className="text-red-600 hover:bg-red-100 cursor-pointer"
                        title="Eliminar permanentemente"
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
