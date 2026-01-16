import { supabase } from "@/lib/supabase/client";
import { BaseRepository } from "@/repository/supabase/base.repository";
import type { ProductEntity } from "@/types/products/entity/product.entity";
import type { CreateProductDTO } from "@/types/products/product.dto";
import type { ProductWithRelations } from "@/types/products/product.relations";

class ProductsRepositoryClass extends BaseRepository<ProductEntity> {
  constructor() {
    super("productos");
  }
  private async insert(table: string, data: any) {
    const { error } = await supabase.from(table).insert(data);
    if (error) throw new Error(error.message);
  }

  private async updateRelated(
    table: string,
    producto_id: number,
    data: any
  ) {
    const { error } = await supabase
      .from(table)
      .update(data)
      .eq("producto_id", producto_id);

    if (error) throw new Error(error.message);
  }

  async findAllWithRelations(): Promise<ProductWithRelations[]> {
    const { data, error } = await supabase
      .from("productos")
      .select(`
        *,
        materiales(*),
        precios(*),
        almacenes(*)
      `);

    if (error) throw new Error(error.message);
    return data as ProductWithRelations[];
  }

  async createProduct(dto: CreateProductDTO): Promise<number> {
    const { data, error } = await supabase
      .from("productos")
      .insert({
        nombre_producto: dto.nombre_producto,
        categoria: dto.categoria,
        estado: dto.estado,
        accion: dto.accion,
        imagen: dto.imagen,
        tipo: dto.tipo,
        grade: dto.grade,
        activo: dto.activo ?? true,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    return data.id;
  }

  async createMaterial(producto_id: number, dto: CreateProductDTO) {
    await this.insert("materiales", {
      producto_id,
      tipo: dto.material.tipo,
      ancho_cm: dto.material.dimensiones.ancho_cm,
      largo_cm: dto.material.dimensiones.largo_cm,
      gramaje_g: dto.material.gramaje_g,
      calibre: dto.material.calibre,
      pliegos_por_paquete: dto.material.pliegos_por_paquete,
      unidad_medida: dto.material.unidad_medida,
      peso_kg: dto.material.peso_kg,
    });
  }

  async createPrice(producto_id: number, dto: CreateProductDTO) {
    await this.insert("precios", {
      producto_id,
      precio_min: dto.precio.precio_min,
      precio_max: dto.precio.precio_max,
      moneda: dto.precio.moneda,
    });
  }

  async createStock(producto_id: number, dto: CreateProductDTO) {
    await this.insert("almacenes", {
      producto_id,
      stock_actual: dto.almacen.stock_actual,
      stock_minimo: dto.almacen.stock_minimo,
      ubicacion: dto.almacen.ubicacion,
    });
  }
  async updateProduct(id: number, dto: CreateProductDTO) {
    const { error } = await supabase
      .from("productos")
      .update({
        nombre_producto: dto.nombre_producto,
        categoria: dto.categoria,
        estado: dto.estado,
        accion: dto.accion,
        imagen: dto.imagen,
        tipo: dto.tipo,
        grade: dto.grade,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }

  async updateMaterial(id: number, dto: CreateProductDTO) {
    await this.updateRelated("materiales", id, {
      tipo: dto.material.tipo,
      ancho_cm: dto.material.dimensiones.ancho_cm,
      largo_cm: dto.material.dimensiones.largo_cm,
      gramaje_g: dto.material.gramaje_g,
      calibre: dto.material.calibre,
      pliegos_por_paquete: dto.material.pliegos_por_paquete,
      unidad_medida: dto.material.unidad_medida,
      peso_kg: dto.material.peso_kg,
    });
  }

  async updatePrice(id: number, dto: CreateProductDTO) {
    await this.updateRelated("precios", id, {
      precio_min: dto.precio.precio_min,
      precio_max: dto.precio.precio_max,
      moneda: dto.precio.moneda,
    });
  }

  async updateStock(id: number, dto: CreateProductDTO) {
    await this.updateRelated("almacenes", id, {
      stock_actual: dto.almacen.stock_actual,
      stock_minimo: dto.almacen.stock_minimo,
      ubicacion: dto.almacen.ubicacion,
    });
  }

  async getMaxId() {
    const { data, error } = await supabase
      .from("productos")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);
    return data?.[0]?.id ?? 0;
  }

  async updateActivo(id: number, activo: boolean) {
    const { error } = await supabase
      .from("productos")
      .update({ activo })
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

export const ProductsRepository = new ProductsRepositoryClass();
