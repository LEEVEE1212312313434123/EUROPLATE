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
import type { Product } from "@/types/product.types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

// 🔹 Diccionario para mostrar nombres amigables de categorías
const categoriaDisplayMap: Record<string, string> = {
  Papel: "Papel",
  Cartón: "Cartón",
  Hoja: "Hoja",
  BobinasCarton: "Bobinas de cartón",
};

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
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
            <TableHead>Producto</TableHead>
            <TableHead className="text-center w-[100px]">Precio Min</TableHead>
            <TableHead className="text-center w-[100px]">Precio Max</TableHead>
            <TableHead className="text-center w-[80px]">Stock</TableHead>
            <TableHead className="text-center w-[120px]">Disponibilidad</TableHead>
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
              const material = product.material;
              const categoriaLegible =
                categoriaDisplayMap[product.categoria] ?? product.categoria;

              // 🔹 Construcción dinámica del nombre del producto
              const partes = [
                categoriaLegible,
                material.tipo,
                material.dimensiones.ancho_cm &&
                material.dimensiones.largo_cm &&
                (material.dimensiones.ancho_cm !== 0 ||
                  material.dimensiones.largo_cm !== 0)
                  ? `${material.dimensiones.ancho_cm}x${material.dimensiones.largo_cm}`
                  : "",
                material.gramaje_g && material.gramaje_g !== 0
                  ? `${material.gramaje_g}g`
                  : "",
                material.calibre && material.calibre !== 0
                  ? `calibre ${material.calibre}`
                  : "",
                material.unidad_medida
                  ? material.unidad_medida.toLowerCase()
                  : "",
                material.pliegos_por_paquete &&
                material.pliegos_por_paquete !== 0
                  ? `${material.pliegos_por_paquete} pliegos`
                  : "",
              ];

              const nombreProducto = partes.filter(Boolean).join(" ");

              // 🔹 Determinar disponibilidad (basado en estado o stock)
              const disponible =
                product.estado?.toLowerCase() === "disponible" ||
                product.almacen?.stock_actual > 0;

              return (
                <TableRow
                  key={product.id}
                  className="h-14 border-b hover:bg-muted/50 transition-colors"
                >
                  <TableCell>{nombreProducto}</TableCell>
                  <TableCell className="text-center w-[100px]">
                    ${product.precio.precio_min.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center w-[100px]">
                    ${product.precio.precio_max.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center w-[80px]">
                    {product.almacen.stock_actual}
                  </TableCell>

                  {/* 🔹 Estado visual actualizado */}
                  <TableCell className="text-center w-[120px]">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        disponible
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {disponible ? "Disponible" : "No disponible"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center w-[90px]">
                    <div className="flex justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
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

      {/* 🔹 Paginación (manteniendo tus botones y diseño) */}
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
