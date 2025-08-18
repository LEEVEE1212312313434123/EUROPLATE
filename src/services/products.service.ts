import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";

export class ProductService {
  private static async fetchProducts(): Promise<Product[]> {
    const response = await fetch(PRODUCTS_CONFIG.PRODUCTS_JSON_PATH);
    if (!response.ok) {
      throw new Error("Failed to load products.json");
    }
    return response.json();
  }

  static async getAll(): Promise<Product[]> {
    return await this.fetchProducts();
  }

  static async getById(id: number): Promise<Product | undefined> {
    const products = await this.fetchProducts();
    return products.find((p) => p.id === id);
  }

  // ⚡ Mock implementation with localStorage since /public/products.json is read-only
  static async add(product: Product): Promise<void> {
    const products = (await this.fetchProducts()) || [];
    const newProducts = [...products, product];
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  static async update(id: number, updatedProduct: Product): Promise<void> {
    const products = (await this.fetchProducts()) || [];
    const newProducts = products.map((p) =>
      p.id === id ? { ...p, ...updatedProduct } : p
    );
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  static async delete(id: number): Promise<void> {
    const products = (await this.fetchProducts()) || [];
    const newProducts = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(newProducts));
  }
}
