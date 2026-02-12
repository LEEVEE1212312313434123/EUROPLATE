import { supabase } from "@/lib/supabaseClient";
import type {
    Importacion,
    ImportacionProducto,
    ImportacionAdjunto,
    EstadoImportacion
} from "@/types/editimportacion.type";

export const ImportacionService = {
    // =======================================================
    // Obtener todas las importaciones
    // =======================================================
    async getAll(): Promise<Importacion[]> {
        const { data, error } = await supabase
            .from("importaciones")
            .select("*");

        if (error) {
            console.error("Error obteniendo importaciones:", error);
            return [];
        }

        return data as Importacion[];
    },

    // =======================================================
    // Obtener detalle por ID
    // =======================================================
    async getById(importacionId: number): Promise<Importacion | null> {
        try {
            const { data: importacionData, error: importacionError } = await supabase
                .from("importaciones")
                .select("*")
                .eq("id", importacionId)
                .single();

            if (importacionError || !importacionData) {
                console.error("Error obteniendo importación:", importacionError);
                return null;
            }

            const { data: productosData } = await supabase
                .from("importacion_productos")
                .select("*")
                .eq("importacion_id", importacionId);

            const { data: adjuntosData } = await supabase
                .from("importacion_adjuntos")
                .select("*")
                .eq("importacion_id", importacionId);

            const { data: estadosData } = await supabase
                .from("estado_importaciones")
                .select("*")
                .eq("importacion_id", importacionId);

            return {
                ...importacionData,
                productos: productosData || [],
                adjuntos: adjuntosData || [],
                estados: estadosData || []
            };

        } catch (err) {
            console.error("Error en getById ImportacionService:", err);
            return null;
        }
    },

    // ===================================================================
    //  UPDATE COMPLETO DE IMPORTACIÓN
    // ===================================================================
    async updateImportacion(
        id: number,
        datos: Partial<Importacion>,
        productos: ImportacionProducto[],
        adjuntos: ImportacionAdjunto[],
        estados: EstadoImportacion[]
    ): Promise<boolean> {
        try {
            // -------------------------------------------------------------------
            // 0) LIMPIAR CAMPOS QUE NO EXISTEN EN LA TABLA importaciones
            // -------------------------------------------------------------------
            const {
                productos: _prod,
                adjuntos: _adj,
                estados: _est,
                id: _id,
                created_at,
                ...camposValidos
            } = datos;

            // -------------------------------------------------------------------
            // 1️⃣ ACTUALIZAR TABLA importaciones
            // -------------------------------------------------------------------
            const { error: updateError } = await supabase
                .from("importaciones")
                .update(camposValidos)
                .eq("id", id);

            if (updateError) {
                console.error("Error actualizando importación:", updateError);
                return false;
            }

            // ============================================================
            // 2️⃣ PRODUCTOS (CRUD COMPLETO)
            // ============================================================

            // Productos actuales en BD
            const { data: productosBD } = await supabase
                .from("importacion_productos")
                .select("id")
                .eq("importacion_id", id);

            const idsBD = productosBD?.map(p => p.id) ?? [];
            const idsIncoming = productos.filter(p => p.id).map(p => p.id);

            // 2.1 Eliminar productos que ya no existen
            const eliminar = idsBD.filter(idBD => !idsIncoming.includes(idBD));
            if (eliminar.length > 0) {
                await supabase
                    .from("importacion_productos")
                    .delete()
                    .in("id", eliminar);
            }

            // 2.2 Insertar / actualizar productos
            for (const p of productos) {
                if (p.id) {
                    const { id: prodId, importacion_id, ...dataToUpdate } = p;

                    await supabase
                        .from("importacion_productos")
                        .update(dataToUpdate)
                        .eq("id", prodId);
                } else {
                    await supabase
                        .from("importacion_productos")
                        .insert({
                            ...p,
                            importacion_id: id
                        });
                }
            }

            // ============================================================
            // 3️⃣ ADJUNTOS (CRUD COMPLETO)
            // ============================================================

            const { data: adjuntosBD } = await supabase
                .from("importacion_adjuntos")
                .select("id")
                .eq("importacion_id", id);

            const adjBDIds = adjuntosBD?.map(a => a.id) ?? [];
            const adjIncomingIds = adjuntos.filter(a => a.id).map(a => a.id);

            // 3.1 eliminar adjuntos que ya no están
            const adjuntosEliminar = adjBDIds.filter(idBD => !adjIncomingIds.includes(idBD));
            if (adjuntosEliminar.length > 0) {
                await supabase
                    .from("importacion_adjuntos")
                    .delete()
                    .in("id", adjuntosEliminar);
            }

            // 3.2 insertar nuevos adjuntos
            const adjNuevos = adjuntos.filter(a => !a.id);
            if (adjNuevos.length > 0) {
                await supabase
                    .from("importacion_adjuntos")
                    .insert(
                        adjNuevos.map(a => ({
                            ...a,
                            importacion_id: id
                        }))
                    );
            }

            // ============================================================
            // 4️⃣ ESTADOS (CRUD COMPLETO)
            // ============================================================

            const { data: estadosBD } = await supabase
                .from("estado_importaciones")
                .select("id")
                .eq("importacion_id", id);

            const estBDIds = estadosBD?.map(e => e.id) ?? [];
            const estIncomingIds = estados.filter(e => e.id).map(e => e.id);

            // 4.1 eliminar estados removidos
            const estadosEliminar = estBDIds.filter(idBD => !estIncomingIds.includes(idBD));
            if (estadosEliminar.length > 0) {
                await supabase
                    .from("estado_importaciones")
                    .delete()
                    .in("id", estadosEliminar);
            }

            // 4.2 insertar / actualizar estados
            for (const e of estados) {
                if (e.id) {
                    const { id: estId, importacion_id, ...dataToUpdate } = e;

                    await supabase
                        .from("estado_importaciones")
                        .update(dataToUpdate)
                        .eq("id", estId);
                } else {
                    await supabase
                        .from("estado_importaciones")
                        .insert({
                            ...e,
                            importacion_id: id
                        });
                }
            }

            return true;

        } catch (error) {
            console.error("Error en updateImportacion:", error);
            return false;
        }
    },

    async crearImportacion(
        datos: Partial<Importacion>,
        productos: ImportacionProducto[],
        adjuntos: ImportacionAdjunto[],
        estados: EstadoImportacion[]
    ): Promise<boolean> {
        try {
            // -------------------------------------------------------------------
            // 0) LIMPIAR CAMPOS QUE NO EXISTEN EN LA TABLA importaciones
            // -------------------------------------------------------------------
            const { productos: _prod, adjuntos: _adj, estados: _est, id, created_at, ...camposValidos } = datos;

            // Normalizar fechas opcionales
            camposValidos.fecha_llegada =
                camposValidos.fecha_llegada || null;

            camposValidos.fecha_entrega =
                camposValidos.fecha_entrega || null;

            camposValidos.fecha_vencimiento =
                camposValidos.fecha_vencimiento || null;

            for (const p of productos) {
                if (!p.sucursal_id) {
                    console.error("Producto sin sucursal asignada");
                    return false;
                }
            }

            // -------------------------------------------------------------------
            // 1️⃣ INSERTAR TABLA importaciones
            // -------------------------------------------------------------------
            const { data: newImport, error: insertError } = await supabase
                .from("importaciones")
                .insert(camposValidos)
                .select("id")
                .single();

            if (insertError || !newImport) {
                console.error("❌ Error creando importación:", insertError);
                return false;
            }

            const importacionId = newImport.id;
            for (const p of productos) {
                await supabase
                    .from("importacion_productos")
                    .insert({
                        ...p,
                        importacion_id: importacionId
                    });
            }
            for (const a of adjuntos) {
                await supabase
                    .from("importacion_adjuntos")
                    .insert({
                        ...a,
                        importacion_id: importacionId,
                        created_at: a.created_at ?? new Date().toISOString()
                    });
            }
            for (const e of estados) {
                await supabase
                    .from("estado_importaciones")
                    .insert({
                        ...e,
                        importacion_id: importacionId,
                        fecha_registro: e.fecha_registro ?? new Date().toISOString()
                    });
            }

            return true;

        } catch (error) {
            console.error("❌ Error en crearImportacion:", error);
            return false;
        }
    }


};

