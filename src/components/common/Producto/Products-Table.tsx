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
import type { ProductWithRelations } from "@/types/products/product.relations";
import { formatProductName } from "@/utils/formatProductName";

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
            <TableHead>SubCategoría</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead className="text-center w-[100px]">Precio Min</TableHead>
            <TableHead className="text-center w-[100px]">Precio Max</TableHead>
            <TableHead className="text-center w-[80px]">Unidad</TableHead>
            <TableHead className="text-center w-[90px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          ) : (
            currentProducts.map((product) => {
              const material = product.materiales?.[0] ?? null;
              const precio = product.precios?.[0] ?? null;

              const categoriaLegible =
                categoriaDisplayMap[product.categoria] ?? product.categoria;

              const nombreProducto = formatProductName(product);

              return (
                <TableRow
                  key={product.id}
                  className="h-14 border-b hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    {product.tipo_producto ?? "-"}
                  </TableCell>

                  <TableCell>
                    {categoriaLegible}
                  </TableCell>

                  <TableCell>
                    {nombreProducto}
                  </TableCell>
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
                    {material?.unidad_medida ?? "-"}
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
                        onClick={() => onDelete(product)}
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
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
