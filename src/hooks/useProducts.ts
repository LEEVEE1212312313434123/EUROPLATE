import { useEffect, useState } from "react";
import { ProductService } from "@/services/products.service";
import type { Product } from "@/types/product.types";
import { toast } from "sonner";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar productos al montar
  useEffect(() => {
    ProductService.getAll()
      .then((data) => {
        // Primero intenta leer del localStorage si existe
        const localData = localStorage.getItem("products");
        if (localData) {
          setProducts(JSON.parse(localData));
        } else {
          setProducts(data);
        }
      })
      .catch(() => setError("No se pudieron cargar los productos."))
      .finally(() => setLoading(false));
  }, []);

  // 🔹 Eliminar producto
  const handleDelete = async (id: number) => {
    try {
      await ProductService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Producto eliminado correctamente");
    } catch {
      toast.error("Error al eliminar el producto");
    }
  };

  // 🔹 Guardar cambios (update o add según caso)
  const handleSave = async (updated: Product) => {
    try {
      if (products.some((p) => p.id === updated.id)) {
        await ProductService.update(updated.id, updated);
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        toast.success("Producto actualizado correctamente");
      } else {
        await ProductService.add(updated);
        setProducts((prev) => [...prev, updated]);
        toast.success("Producto agregado correctamente");
      }
    } catch {
      toast.error("Error al guardar el producto");
    }
  };

  return { products, setProducts, loading, error, handleDelete, handleSave };
}
