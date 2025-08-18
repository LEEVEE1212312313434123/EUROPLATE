import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";

export class ProductService {
  private static async fetchProducts(): Promise<Product[]> {
    const local = localStorage.getItem("products");
    if (local) {
      return JSON.parse(local);
    }

    // primera vez, carga los iniciales
    const response = await fetch(PRODUCTS_CONFIG.PRODUCTS_JSON_PATH);
    if (!response.ok) throw new Error("No se pudo cargar products.json");

    const data: Product[] = await response.json();
    localStorage.setItem("products", JSON.stringify(data));
    return data;
  }

  static async getAll(): Promise<Product[]> {
    return await this.fetchProducts();
  }

  static async addMany(newProducts: Product[]): Promise<void> {
    const products = await this.fetchProducts();
    const merged = [...products, ...newProducts];
    localStorage.setItem("products", JSON.stringify(merged));
  }

  static async getById(id: number): Promise<Product | undefined> {
    const products = await this.fetchProducts();
    return products.find((p) => p.id === id);
  }

  static async add(product: Product): Promise<void> {
    const products = await this.fetchProducts();
    const newProducts = [...products, product];
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  static async update(id: number, updatedProduct: Product): Promise<void> {
    const products = await this.fetchProducts();
    const newProducts = products.map((p) =>
      p.id === id ? { ...p, ...updatedProduct } : p
    );
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  static async delete(id: number): Promise<void> {
    const products = await this.fetchProducts();
    const newProducts = products.filter((p) => p.id !== id);
    localStorage.setItem("products", JSON.stringify(newProducts));
  }

  // Nuevo método para obtener el ID máximo
  static async getMaxId(): Promise<number> {
    const products = await this.fetchProducts();
    const ids = products.map((p) => p.id);
    return Math.max(...ids, 0); // Retorna el máximo ID, si no hay productos, retorna 0
  }
}
