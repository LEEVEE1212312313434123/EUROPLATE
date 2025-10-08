// src/hooks/useProducts.ts
import { useEffect, useState } from "react";
import { ProductService } from "@/services/products.service";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message ?? "Error al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  const handleSave = async (product: Product) => {
    try {
      if (products.some((p) => p.id === product.id)) {
        await ProductService.update(product.id, product);
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? product : p))
        );
        toast.success("Producto actualizado correctamente");
      } else {
        const newId = await ProductService.add(product);
        setProducts((prev) => [...prev, { ...product, id: newId }]);
        toast.success("Producto agregado correctamente");
      }
    } catch (err) {
      toast.error("Error al guardar el producto");
    }
  };

  return { products, loading, error, handleDelete, handleSave, reload: loadProducts };
}
