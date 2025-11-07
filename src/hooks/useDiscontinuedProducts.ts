// ✅ src/hooks/useDiscontinuedProducts.ts
import { useEffect, useState } from "react";
import { ProductService } from "@/services/products.service";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";

export function useDiscontinuedProducts() {
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

      // ✅ Mostrar productos que estén "Descontinuados" o con stock = 0
      const discontinued = data.filter(
        (p) => p.estado === "Descontinuado" || p.almacen.stock_actual === 0
      );

      setProducts(discontinued);
    } catch (err: any) {
      setError(err.message ?? "Error al cargar los productos descontinuados");
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

  const handleRestore = async (id: number) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      await ProductService.update(id, { ...product, estado: "Disponible" });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto restaurado correctamente");
    } catch {
      toast.error("Error al restaurar el producto");
    }
  };

  return { products, loading, error, handleDelete, handleRestore, reload: loadProducts };
}
