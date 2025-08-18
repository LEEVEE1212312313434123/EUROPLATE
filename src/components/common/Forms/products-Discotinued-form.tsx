import { useEffect, useState } from "react";
import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/Producto/products.edit.dialog";
import { ProductDeleteDialog } from "@/components/common/Producto/product.delete.dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DashboardProductsDiscount() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(PRODUCTS_CONFIG.PRODUCTS_JSON_PATH);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Product[] = await res.json();

        // 🔹 Filtrar productos con descuentos
        const discounted = data.filter(
          (product) => product.precio.precio_min < product.precio.precio_max
        );
        setProducts(discounted);
      } catch (err) {
        setError("Failed to load discounted products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="p-6">Cargando productos con descuento...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const handleEditClick = (product: Product) => {
    setSelectedProductForEdit(product);
    setEditOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProductForDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Producto eliminado correctamente");
    setDeleteOpen(false);
  };

  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Producto actualizado correctamente");
    setEditOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Productos con Descuento</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Precio Mínimo</TableHead>
            <TableHead>Precio Máximo</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Fecha Registro</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.nombre_producto}</TableCell>
              <TableCell>${product.precio.precio_min}</TableCell>
              <TableCell>${product.precio.precio_max}</TableCell>
              <TableCell>{product.almacen.stock_actual}</TableCell>
              <TableCell>{product.estado}</TableCell>
              <TableCell>{product.fecha_registro}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProductForEdit && (
        <ProductEditDialog
          open={editOpen}
          product={selectedProductForEdit}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      {selectedProductForDelete && (
        <ProductDeleteDialog
          open={deleteOpen}
          product={selectedProductForDelete}
          onOpenChange={setDeleteOpen}
          onDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
