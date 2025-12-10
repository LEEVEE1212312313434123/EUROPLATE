import { supabase } from "@/lib/supabaseClient";
import type { ImportacionWithRelations } from "@/types/importaciones/importacion.relations";

export class ImportacionComprasRepository {
  static async getComprasBase(): Promise<ImportacionWithRelations[]> {
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
        detalle: row.detalle ?? "Sin descripción",
        proveedor: row.proveedor ?? "N/A",
        pais_origen: row.pais_origen ?? "N/A",
        adjuntos: row.importacion_adjuntos ?? [],
        productos: row.importacion_productos ?? [],
    }));
    }
  static async getCompraDetailById(id: number): Promise<ImportacionWithRelations> {
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

    return {
        ...data,
        adjuntos: data.importacion_adjuntos ?? [],
        productos: data.importacion_productos ?? [],
    };
    }
  static async registrarEntrega(importacionId: number, almacenId: number) {
    const { error } = await supabase.from("estado_importaciones").insert([
      { importacion_id: importacionId, estado: "Entregado", almacen_id: almacenId },
    ]);

    if (error) throw new Error(error.message);

    await supabase
      .from("importaciones")
      .update({ fecha_entrega: new Date().toISOString() })
      .eq("id", importacionId);
  }
  static async registrarCancelacion(importacionId: number, motivo: string) {
    const { error } = await supabase.from("estado_importaciones").insert([
      { importacion_id: importacionId, estado: "Cancelado", motivo_cancelacion: motivo },
    ]);

    if (error) throw new Error(error.message);

    await supabase.from("importaciones").update({ fecha_entrega: null }).eq("id", importacionId);
  }
  static async actualizarEstado(id: number, estado: string, opts?: any) {
    const estados = ["Registrado", "En Transito", "Entregado", "Cancelado"];
    if (!estados.includes(estado)) throw new Error("Estado inválido");
    const { data: ultimo } = await supabase
      .from("estado_importaciones")
      .select("id, estado")
      .eq("importacion_id", id)
      .order("fecha_registro", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ultimo?.estado === "Entregado" && estado === "Cancelado") {
      throw new Error("No puedes cancelar una importación ya entregada");
    }

    const payload: any = { estado };
    if (opts?.almacenId) payload.almacen_id = opts.almacenId;
    if (opts?.motivo) payload.motivo_cancelacion = opts.motivo;

    if (ultimo?.id) {
      await supabase.from("estado_importaciones").update(payload).eq("id", ultimo.id);
    } else {
      await supabase.from("estado_importaciones").insert([{ importacion_id: id, ...payload }]);
    }

    await supabase.from("importaciones").update({ estado }).eq("id", id);
  }
}
