import { supabase } from "@/lib/supabaseClient";
import type { CreateImportacionDTO } from "@/types/importaciones/importacion.dto";
import type { ImportacionWithRelations } from "@/types/importaciones/importacion.relations";
import type { ImportacionAdjuntoEntity } from "@/types/importaciones/entity/importacion.adjunto.entity";
import type { ImportacionProductoEntity } from "@/types/importaciones/entity/importacion.producto.entity";

export class ImportacionRepository {
  static async getAll(): Promise<ImportacionWithRelations[]> {
    const { data, error } = await supabase
      .from("importaciones")
      .select(`
        *,
        importacion_adjuntos (*),
        importacion_productos (*)
      `)
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);

    return (data ?? []).map((row: any) => ({
      ...row,
      adjuntos: row.importacion_adjuntos ?? [],
      productos: row.importacion_productos ?? [],
    }));
  }
  static async getById(id: number): Promise<ImportacionWithRelations | null> {
    const { data, error } = await supabase
      .from("importaciones")
      .select(`
        *,
        importacion_adjuntos (*),
        importacion_productos (*)
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);

    if (!data) return null;

    return {
      ...data,
      adjuntos: data.importacion_adjuntos ?? [],
      productos: data.importacion_productos ?? [],
    };
  }
  static async create(dto: CreateImportacionDTO): Promise<number> {
    
    const payload = {
      num_dua: dto.num_dua,

      fecha_llegada: dto.fechas.llegada,
      fecha_entrega: dto.fechas.entrega ?? null,
      fecha_vencimiento: dto.fechas.vencimiento ?? null,

      orden_compra: dto.compra.orden_compra ?? null,
      detalle: dto.compra.detalle ?? null,

      proveedor: dto.datos_importacion.proveedor ?? null,
      agente_aduanas: dto.datos_importacion.agente_aduanas ?? null,
      pais_origen: dto.datos_importacion.pais_origen ?? null,
      puerto_origen: dto.datos_importacion.puerto_origen ?? null,
      puerto_destino: dto.datos_importacion.puerto_destino ?? null,
      container: dto.datos_importacion.container ?? null,

      factura: dto.economia.factura ?? null,
      unidad: dto.economia.unidad ?? null,
      cantidad: dto.economia.cantidad ?? null,
      valor_fob_usd: dto.economia.valor_fob_usd ?? null,
      transporte_maritimo_usd: dto.economia.transporte_maritimo_usd ?? null,
      valor_cfr_usd: dto.economia.valor_cfr_usd ?? null,
      liquidacion_moneda: dto.economia.liquidacion_moneda ?? null,
      liquidacion_monto: dto.economia.liquidacion_monto ?? null,
      estado: dto.estado ?? "En Transito",
    };

    const { data, error } = await supabase
      .from("importaciones")
      .insert([payload])
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return data.id;
  }
  static async insertAdjuntos(
    importacionId: number, 
    adjuntos: CreateImportacionDTO["adjuntos"] | undefined
  ) {
    if (!adjuntos?.length) return;

    const payload: Omit<ImportacionAdjuntoEntity, "id" | "created_at">[] =
      adjuntos.map(a => ({
        importacion_id: importacionId,
        url: a.url,
        nombre_archivo: a.nombre_archivo ?? null,
      }));

    const { error } = await supabase
      .from("importacion_adjuntos")
      .insert(payload);

    if (error) throw new Error(error.message);
  }
  static async insertProductos(
    importacionId: number, 
    productos: CreateImportacionDTO["productos"]
  ) {
    if (!productos?.length) return;

    const payload: Omit<ImportacionProductoEntity, "id">[] =
      productos.map(p => ({
        importacion_id: importacionId,
        producto_id: p.producto_id ?? null,
        categoria: p.categoria ?? null,
        descripcion: p.descripcion ?? null,
        cantidad: p.cantidad ?? null,
        unidad_medida: p.unidad_medida ?? null,
        precio_unitario: p.precio_unitario ?? null,
        importe_usd: p.importe_usd ?? null,
      }));

    const { error } = await supabase
      .from("importacion_productos")
      .insert(payload);

    if (error) throw new Error(error.message);
  }
  static async update(id: number, dto: Partial<CreateImportacionDTO>) {

    const payload: Record<string, any> = {};

    if (dto.num_dua) payload.num_dua = dto.num_dua;
    if (dto.estado) payload.estado = dto.estado;

    if (dto.fechas) {
      if (dto.fechas.llegada) payload.fecha_llegada = dto.fechas.llegada;
      if (dto.fechas.entrega) payload.fecha_entrega = dto.fechas.entrega;
      if (dto.fechas.vencimiento) payload.fecha_vencimiento = dto.fechas.vencimiento;
    }

    if (dto.compra) {
      payload.orden_compra = dto.compra.orden_compra ?? null;
      payload.detalle = dto.compra.detalle ?? null;
    }

    if (dto.datos_importacion) {
      payload.proveedor = dto.datos_importacion.proveedor ?? null;
      payload.agente_aduanas = dto.datos_importacion.agente_aduanas ?? null;
      payload.pais_origen = dto.datos_importacion.pais_origen ?? null;
      payload.puerto_origen = dto.datos_importacion.puerto_origen ?? null;
      payload.puerto_destino = dto.datos_importacion.puerto_destino ?? null;
      payload.container = dto.datos_importacion.container ?? null;
    }

    if (dto.economia) {
      payload.factura = dto.economia.factura ?? null;
      payload.unidad = dto.economia.unidad ?? null;
      payload.cantidad = dto.economia.cantidad ?? null;
      payload.valor_fob_usd = dto.economia.valor_fob_usd ?? null;
      payload.transporte_maritimo_usd = dto.economia.transporte_maritimo_usd ?? null;
      payload.valor_cfr_usd = dto.economia.valor_cfr_usd ?? null;
      payload.liquidacion_moneda = dto.economia.liquidacion_moneda ?? null;
      payload.liquidacion_monto = dto.economia.liquidacion_monto ?? null;
    }

    const { error } = await supabase
      .from("importaciones")
      .update(payload)
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
  static async clearChildren(id: number) {
    await supabase.from("importacion_adjuntos").delete().eq("importacion_id", id);
    await supabase.from("importacion_productos").delete().eq("importacion_id", id);
  }
  static async delete(id: number) {
    const { error } = await supabase
      .from("importaciones")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}
