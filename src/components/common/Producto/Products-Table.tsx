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
import type { Product } from "@/types/product.types";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Producto</TableHead>
          <TableHead className="text-center w-[100px]">Precio Min</TableHead>
          <TableHead className="text-center w-[100px]">Precio Max</TableHead>
          <TableHead className="text-center w-[80px]">Stock</TableHead>
          <TableHead className="text-center w-[90px]">Estado</TableHead>
          <TableHead className="text-center w-[90px]">Acciones</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {products.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6">
              No se encontraron productos.
            </TableCell>
          </TableRow>
        ) : (
          products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {`${product.categoria} ${product.material.tipo} ${
                  product.material.dimensiones.ancho_cm
                }x${product.material.dimensiones.largo_cm} ${
                  product.material.gramaje_g
                }g calibre ${
                  product.material.calibre
                } ${product.material.unidad_medida.toLowerCase()} ${
                  product.material.pliegos_por_paquete
                } pliegos`}
              </TableCell>
              <TableCell className="text-center w-[100px]">
                ${product.precio.precio_min.toFixed(2)}
              </TableCell>
              <TableCell className="text-center w-[100px]">
                ${product.precio.precio_max.toFixed(2)}
              </TableCell>
              <TableCell className="text-center w-[80px]">
                {product.almacen.stock_actual}
              </TableCell>
              <TableCell className="text-center w-[90px]">
                {product.estado}
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
          ))
        )}
      </TableBody>
    </Table>
  );
}
