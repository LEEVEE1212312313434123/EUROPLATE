import { useEffect, useState } from "react";
import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/product-edit-dialog";
import { ProductViewDialog } from "@/components/common/product-view-dialog";
import { ProductDeleteDialog } from "@/components/common/product-delete-dialog";

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

        // Filtrar solo productos con descuento
        const discounted = data.filter(
          (product) => product.minPrice < product.maxPrice
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

  if (loading) return <div className="p-6">Loading discounted products...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  const handleEditClick = (product: Product) => {
    setSelectedProductForEdit(product);
    setEditOpen(true);
  };

  const handleViewClick = (product: Product) => {
    setSelectedProductForView(product);
    setViewOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProductForDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Product deleted successfully");
    setDeleteOpen(false);
  };

  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Product updated successfully");
    setEditOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Discounted Products</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Min Price</TableHead>
            <TableHead>Max Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date Added</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>${product.minPrice}</TableCell>
              <TableCell>${product.maxPrice}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell>{product.status}</TableCell>
              <TableCell>
                {new Date(product.dateAdded).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewClick(product)}
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(product)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProductForView && (
        <ProductViewDialog
          open={viewOpen}
          product={selectedProductForView}
          onOpenChange={setViewOpen}
        />
      )}

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
