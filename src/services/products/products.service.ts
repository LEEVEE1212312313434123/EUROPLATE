import { ProductsRepository } from "@/repository/products/products.repository";
import type { CreateProductDTO } from "@/types/products/product.dto";
import type { ProductWithRelations } from "@/types/products/product.relations";

class ProductsServiceClass {
  async getAll(): Promise<ProductWithRelations[]> {
    return await ProductsRepository.findAllWithRelations();
  }

  async create(dto: CreateProductDTO): Promise<number> {
    const producto_id = await ProductsRepository.createProduct(dto);
    await ProductsRepository.createMaterial(producto_id, dto);
    await ProductsRepository.createPrice(producto_id, dto);
    await ProductsRepository.createStock(producto_id, dto);
    return producto_id;
  }
  async update(id: number, dto: CreateProductDTO) {
    await ProductsRepository.updateProduct(id, dto);
    await ProductsRepository.updateMaterial(id, dto);
    await ProductsRepository.updatePrice(id, dto);
    await ProductsRepository.updateStock(id, dto);
  }
  async updateActivo(id: number, activo: boolean) {
    await ProductsRepository.updateActivo(id, activo);
  }
  async getMaxId() {
    return await ProductsRepository.getMaxId();
  }
  async delete(id: number) {
    return await ProductsRepository.delete(id);
  }
}

export const ProductsService = new ProductsServiceClass();
