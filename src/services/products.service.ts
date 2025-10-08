import { supabase } from "@/lib/supabaseClient";
import type { Product } from "@/types/product.types";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id,
        nombre_producto,
        categoria,
        estado,
        accion,
        fecha_registro,
        imagen,
        tipo,
        materiales(*),
        precios(*),
        almacenes(*)
      `);

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      nombre_producto: p.nombre_producto,
      categoria: p.categoria,
      estado: p.estado,
      accion: p.accion,
      fecha_registro: p.fecha_registro,
      imagen: p.imagen,
      tipo: p.tipo,
      material: {
        tipo: p.materiales?.[0]?.tipo ?? "",
        dimensiones: {
          ancho_cm: p.materiales?.[0]?.ancho_cm ?? 0,
          largo_cm: p.materiales?.[0]?.largo_cm ?? 0,
        },
        gramaje_g: p.materiales?.[0]?.gramaje_g ?? 0,
        calibre: p.materiales?.[0]?.calibre ?? 0,
        pliegos_por_paquete: p.materiales?.[0]?.pliegos_por_paquete ?? 0,
        unidad_medida: p.materiales?.[0]?.unidad_medida ?? "",
        peso_kg: p.materiales?.[0]?.peso_kg ?? 0,
      },
      precio: {
        precio_min: p.precios?.[0]?.precio_min ?? 0,
        precio_max: p.precios?.[0]?.precio_max ?? 0,
        moneda: p.precios?.[0]?.moneda ?? "PEN",
      },
      almacen: {
        stock_actual: p.almacenes?.[0]?.stock_actual ?? 0,
        stock_minimo: p.almacenes?.[0]?.stock_minimo ?? 0,
        ubicacion: p.almacenes?.[0]?.ubicacion ?? "",
      },
    }));
  },
  async add(producto: Product) {
    const { data: prodData, error: prodError } = await supabase
      .from("productos")
      .insert([
        {
          nombre_producto: producto.nombre_producto,
          categoria: producto.categoria,
          estado: producto.estado,
          accion: producto.accion,
          imagen: producto.imagen,
          tipo: producto.tipo,
        },
      ])
      .select("id")
      .single();

    if (prodError) throw new Error(prodError.message);
    const producto_id = prodData.id;
    const { error: matError } = await supabase.from("materiales").insert([
      {
        producto_id,
        tipo: producto.material.tipo,
        ancho_cm: producto.material.dimensiones.ancho_cm,
        largo_cm: producto.material.dimensiones.largo_cm,
        gramaje_g: producto.material.gramaje_g,
        calibre: producto.material.calibre,
        pliegos_por_paquete: producto.material.pliegos_por_paquete,
        unidad_medida: producto.material.unidad_medida,
        peso_kg: producto.material.peso_kg,
      },
    ]);
    if (matError) throw new Error(matError.message);

    const { error: priceError } = await supabase.from("precios").insert([
      {
        producto_id,
        precio_min: producto.precio.precio_min,
        precio_max: producto.precio.precio_max,
        moneda: producto.precio.moneda,
      },
    ]);
    if (priceError) throw new Error(priceError.message);

    const { error: stockError } = await supabase.from("almacenes").insert([
      {
        producto_id,
        stock_actual: producto.almacen.stock_actual,
        stock_minimo: producto.almacen.stock_minimo,
        ubicacion: producto.almacen.ubicacion,
      },
    ]);
    if (stockError) throw new Error(stockError.message);

    return producto_id;
  },
  async update(id: number, producto: Product) {
    const { error: prodError } = await supabase
      .from("productos")
      .update({
        nombre_producto: producto.nombre_producto,
        categoria: producto.categoria,
        estado: producto.estado,
        accion: producto.accion,
        imagen: producto.imagen,
        tipo: producto.tipo,
      })
      .eq("id", id);
    if (prodError) throw new Error(prodError.message);

    await supabase.from("materiales").update({
      tipo: producto.material.tipo,
      ancho_cm: producto.material.dimensiones.ancho_cm,
      largo_cm: producto.material.dimensiones.largo_cm,
      gramaje_g: producto.material.gramaje_g,
      calibre: producto.material.calibre,
      pliegos_por_paquete: producto.material.pliegos_por_paquete,
      unidad_medida: producto.material.unidad_medida,
      peso_kg: producto.material.peso_kg,
    }).eq("producto_id", id);

    await supabase.from("precios").update({
      precio_min: producto.precio.precio_min,
      precio_max: producto.precio.precio_max,
      moneda: producto.precio.moneda,
    }).eq("producto_id", id);

    await supabase.from("almacenes").update({
      stock_actual: producto.almacen.stock_actual,
      stock_minimo: producto.almacen.stock_minimo,
      ubicacion: producto.almacen.ubicacion,
    }).eq("producto_id", id);
  },

  async delete(id: number) {
    const { error } = await supabase.from("productos").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
  async addMany(productos: Product[]) {
    await Promise.all(productos.map((p) => this.add(p)));
  },
  async getMaxId(): Promise<number> {
    const { data, error } = await supabase
      .from("productos")
      .select("id")
      .order("id", { ascending: false })
      .limit(1);

    if (error) throw new Error(error.message);
    if (!data || data.length === 0) return 0;

    return data[0].id;
  },
};
