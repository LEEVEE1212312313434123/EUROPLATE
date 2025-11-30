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
      // 👉 Actualizar solo el campo "activo" en el registro principal
      await ProductService.updateActivo(id, false);

      // 👉 Actualizar en estado local sin eliminar
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, activo: false } : p
        )
      );

      toast.success("Producto descontinuado correctamente");
    } catch {
      toast.error("Error al descontinuar el producto");
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
