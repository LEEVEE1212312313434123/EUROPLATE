import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, ChevronLeft, ChevronRight, AlertTriangle  } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Product } from "@/types/product.types";

const categoriaDisplayMap: Record<string, string> = {
  Papel: "Papel",
  Cartón: "Cartón",
  Hoja: "Hoja",
  BobinasCarton: "Bobinas de cartón",
};

interface ProductTableProps {
  products: Product[];
  onDelete: (product: Product) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const start = page * pageSize;
  const end = start + pageSize;
  const currentProducts = products.slice(start, end);
  const totalPages = Math.ceil(products.length / pageSize);

  const handleEdit = (product: Product) => {
    console.log("Producto que se está editando:", product);
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
        <TableHead className="text-center w-[120px]">Disponibilidad</TableHead>
        <TableHead className="text-center w-[80px]">Stock Actual</TableHead>
        <TableHead className="text-center w-[80px]">Unidad</TableHead>

        <TableHead className="text-center w-[90px]">Acciones</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody>
      {currentProducts.length === 0 ? (
        <TableRow>
          <TableCell colSpan={7} className="text-center py-6">
            No se encontraron productos.
          </TableCell>
        </TableRow>
      ) : (
        currentProducts.map((product) => {
          const categoriaLegible = categoriaDisplayMap[product.categoria] ?? product.categoria;
          const material = product.material;
          const nombreProducto = [
            categoriaLegible,
            material.tipo,
            material.dimensiones.ancho_cm && material.dimensiones.largo_cm
              ? `${material.dimensiones.ancho_cm}x${material.dimensiones.largo_cm}`
              : "",
            material.gramaje_g ? `${material.gramaje_g}g` : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <TableRow key={product.id} className="h-14 border-b hover:bg-muted/50 transition-colors">
              <TableCell>{categoriaLegible}</TableCell>
              <TableCell>{nombreProducto}</TableCell>
              <TableCell className="text-center">${product.precio.precio_min.toFixed(2)}</TableCell>
              <TableCell className="text-center">${product.precio.precio_max.toFixed(2)}</TableCell>

              <TableCell className="text-center">
                {product.almacen.stock_actual === 0 ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    No disponible
                  </span>
                ) : product.almacen.stock_actual <= 5 ? (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                    Pocas
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    Disponible
                  </span>
                )}
              </TableCell>
              <TableCell className="text-center">{product.almacen.stock_actual}</TableCell>
              <TableCell className="text-center">
                {product.material.unidad_medida || "-"}
              </TableCell>

              <TableCell className="text-center">
                <div className="flex justify-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(product)}
                    className="text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(product)}
                    className="text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary cursor-pointer"
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
