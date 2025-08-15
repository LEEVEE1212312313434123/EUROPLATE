import { useEffect, useState } from "react";
import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/product-edit-dialog";
import { ProductViewDialog } from "@/components/common/product-view-dialog";
import { ProductDeleteDialog } from "@/components/common/product-delete-dialog"; // Importar diálogo eliminar
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

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] =
    useState<Product | null>(null);

  // Estado para eliminar
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

        // Solo productos con descuento > 0
        const discountedProducts = data.filter(
          (product) => product.discount > 0
        );
        setProducts(discountedProducts);
      } catch (err) {
        setError("No se pudieron cargar los productos con descuento.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading)
    return <div className="p-6">Cargando productos con descuento...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const handleEditClick = (product: Product) => {
    setSelectedProductForEdit(product);
    setEditOpen(true);
  };

  const handleViewClick = (product: Product) => {
    setSelectedProductForView(product);
    setViewOpen(true);
  };

  // Abrir diálogo eliminar
  const handleDeleteClick = (product: Product) => {
    setSelectedProductForDelete(product);
    setDeleteOpen(true);
  };

  // Confirmar eliminación
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
            <TableHead>Nombre</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Descuento</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>{Math.round(product.discount * 100)}%</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewClick(product)}
                    className="cursor-pointer"
                  >
                    Ver
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(product)}
                    className="cursor-pointer"
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                    className="cursor-pointer"
                  >
                    Eliminar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog para ver producto */}
      {selectedProductForView && (
        <ProductViewDialog
          open={viewOpen}
          product={selectedProductForView}
          onOpenChange={setViewOpen}
        />
      )}

      {/* Dialog para editar producto */}
      {selectedProductForEdit && (
        <ProductEditDialog
          open={editOpen}
          product={selectedProductForEdit}
          onClose={() => setEditOpen(false)}
          onSave={handleSave}
        />
      )}

      {/* Dialog para eliminar producto */}
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
