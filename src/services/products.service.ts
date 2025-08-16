import type { Product } from "@/types/product.types";
import { PRODUCTS_CONFIG } from "@/config/products.config";

let productsCopy: Product[] = [];

/**
 * Carga el JSON y crea la copia enriquecida con campo `type`.
 */
export async function loadProducts(): Promise<Product[]> {
  if (productsCopy.length > 0) {
    // Ya cargados
    return productsCopy;
  }

  const response = await fetch(PRODUCTS_CONFIG.PRODUCTS_JSON_PATH);
  if (!response.ok) {
    throw new Error("Failed to load products JSON");
  }

  const data = await response.json();

  // Mapear y agregar campo `type` (ejemplo: todos como 'product')
  productsCopy = data.map((p: Omit<Product, "type">) => ({
    ...p,
    type: "product",
  }));

  return productsCopy;
}

/**
 * Permite obtener la copia en memoria (modificable)
 */
export function getProductsCopy(): Product[] {
  return productsCopy;
}

/**
 * Ejemplo función para modificar productos en la copia
 */
export function updateProduct(updatedProduct: Product) {
  const index = productsCopy.findIndex((p) => p.id === updatedProduct.id);
  if (index !== -1) {
    productsCopy[index] = updatedProduct;
  }
}

export function deleteProduct(productId: number) {
  productsCopy = productsCopy.filter((p) => p.id !== productId);
}
