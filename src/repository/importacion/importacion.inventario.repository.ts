import { supabase } from "@/lib/supabaseClient";

export class ImportacionInventarioRepository {
  static async getImportacionesBase() {
    const { data, error } = await supabase
      .from("importacion_productos")
      .select(`
        id, producto_id, categoria, descripcion, cantidad, unidad_medida,
        precio_unitario, importe_usd,
        importaciones ( id, num_dua, orden_compra )
      `);

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      id: row.id,
      producto_id: row.producto_id,
      categoria: row.categoria,
      descripcion: row.descripcion,
      cantidad: row.cantidad,
      unidad_medida: row.unidad_medida,
      precio_unitario: row.precio_unitario,
      importe_usd: row.importe_usd,
      num_dua: row.importaciones?.num_dua ?? null,
      orden_compra: row.importaciones?.orden_compra ?? null,
    }));
  }
  static async getProductosBase() {
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id,
        nombre_producto,
        categoria,
        materiales ( unidad_medida, gramaje_g, ancho_cm, largo_cm, peso_kg ),
        precios ( precio_min, precio_max, moneda ),
        almacenes ( stock_actual, stock_minimo, ubicacion )
      `);

    if (error) throw new Error(error.message);

    return (data ?? []).map((p: any) => ({
      id: p.id,
      nombre_producto: p.nombre_producto,
      categoria: p.categoria,
      unidad_medida: p.materiales?.[0]?.unidad_medida ?? "",
      gramaje: p.materiales?.[0]?.gramaje_g ?? 0,
      ancho: p.materiales?.[0]?.ancho_cm ?? 0,
      largo: p.materiales?.[0]?.largo_cm ?? 0,
      peso: p.materiales?.[0]?.peso_kg ?? 0,
      precio_min: p.precios?.[0]?.precio_min ?? 0,
      precio_max: p.precios?.[0]?.precio_max ?? 0,
      moneda: p.precios?.[0]?.moneda ?? "",
      stock_actual: p.almacenes?.[0]?.stock_actual ?? 0,
      ubicacion: p.almacenes?.[0]?.ubicacion ?? "",
    }));
  }
  static async getInventarioCompleto() {
    const importaciones = await this.getImportacionesBase();
    const productos = await this.getProductosBase();

    return importaciones.map((imp) => {
      const prod = productos.find((p) => p.id === imp.producto_id);

      return {
        ...imp,
        nombre_producto: prod?.nombre_producto ?? "Sin nombre",
        categoria: prod?.categoria ?? "",
        unidad_medida: prod?.unidad_medida ?? imp.unidad_medida,
        gramaje: prod?.gramaje ?? 0,
        ancho: prod?.ancho ?? 0,
        largo: prod?.largo ?? 0,
        peso: prod?.peso ?? 0,
        precio_min: prod?.precio_min ?? 0,
        precio_max: prod?.precio_max ?? 0,
        moneda: prod?.moneda ?? 0,
        stock_actual: imp.cantidad ?? 0,
        ubicacion: prod?.ubicacion ?? "-",
      };
    });
  }
}
