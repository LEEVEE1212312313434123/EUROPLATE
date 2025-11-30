import { supabase } from "@/lib/supabaseClient";
import type {
  Importacion
} from "@/types/importacion.types";

export const ImportacionService = {
  async getAll(): Promise<Importacion[]> {
    const { data, error } = await supabase
      .from("importaciones")
      .select(`
        *,
        importacion_adjuntos(*),
        importacion_productos(*)
      `)
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((imp: any) => ({
      ...imp,
      adjuntos: imp.importacion_adjuntos ?? [],
      productos: imp.importacion_productos ?? [],
    }));
  },

  async add(importacion: Importacion): Promise<number> {
    const { data, error } = await supabase
      .from("importaciones")
      .insert([
        {
          num_dua: importacion.num_dua,
          fecha_llegada: importacion.fecha_llegada,
          fecha_entrega: importacion.fecha_entrega,
          orden_compra: importacion.orden_compra,
          detalle: importacion.detalle,
          proveedor: importacion.proveedor,
          agente_aduanas: importacion.agente_aduanas,
          pais_origen: importacion.pais_origen,
          puerto_origen: importacion.puerto_origen,
          puerto_destino: importacion.puerto_destino,
          container: importacion.container,
          factura: importacion.factura,
          fecha_vencimiento: importacion.fecha_vencimiento,
          unidad: importacion.unidad,
          cantidad: importacion.cantidad,
          valor_fob_usd: importacion.valor_fob_usd,
          transporte_maritimo_usd: importacion.transporte_maritimo_usd,
          valor_cfr_usd: importacion.valor_cfr_usd,
          liquidacion_moneda: importacion.liquidacion_moneda,
          liquidacion_monto: importacion.liquidacion_monto,
        },
      ])
      .select("id")
      .single();

    if (error) throw new Error(error.message);
    const importacion_id = data.id;

    // Adjuntos
    if (importacion.adjuntos?.length) {
      const { error: adjError } = await supabase
        .from("importacion_adjuntos")
        .insert(
          importacion.adjuntos.map((a) => ({
            importacion_id,
            url: a.url,
            nombre_archivo: a.nombre_archivo,
          }))
        );
      if (adjError) throw new Error(adjError.message);
    }

    // Productos
    if (importacion.productos?.length) {
      const { error: prodError } = await supabase
        .from("importacion_productos")
        .insert(
          importacion.productos.map((p) => ({
            importacion_id,
            producto_id: p.producto_id,
            categoria: p.categoria,
            descripcion: p.descripcion,
            cantidad: p.cantidad,
            unidad_medida: p.unidad_medida,
            precio_unitario: p.precio_unitario,
            importe_usd: p.importe_usd,
          }))
        );
      if (prodError) throw new Error(prodError.message);
    }

    return importacion_id;
  },

  async update(id: number, importacion: Importacion) {
    const { error } = await supabase
      .from("importaciones")
      .update({
        num_dua: importacion.num_dua,
        fecha_llegada: importacion.fecha_llegada,
        fecha_entrega: importacion.fecha_entrega,
        orden_compra: importacion.orden_compra,
        detalle: importacion.detalle,
        proveedor: importacion.proveedor,
        agente_aduanas: importacion.agente_aduanas,
        pais_origen: importacion.pais_origen,
        puerto_origen: importacion.puerto_origen,
        puerto_destino: importacion.puerto_destino,
        container: importacion.container,
        factura: importacion.factura,
        fecha_vencimiento: importacion.fecha_vencimiento,
        unidad: importacion.unidad,
        cantidad: importacion.cantidad,
        valor_fob_usd: importacion.valor_fob_usd,
        transporte_maritimo_usd: importacion.transporte_maritimo_usd,
        valor_cfr_usd: importacion.valor_cfr_usd,
        liquidacion_moneda: importacion.liquidacion_moneda,
        liquidacion_monto: importacion.liquidacion_monto,
      })
      .eq("id", id);

    if (error) throw new Error(error.message);

    // Eliminar previos
    await supabase.from("importacion_adjuntos").delete().eq("importacion_id", id);
    await supabase.from("importacion_productos").delete().eq("importacion_id", id);

    // Reinsertar adjuntos
    if (importacion.adjuntos?.length) {
      await supabase.from("importacion_adjuntos").insert(
        importacion.adjuntos.map((a) => ({
          importacion_id: id,
          url: a.url,
          nombre_archivo: a.nombre_archivo,
        }))
      );
    }

    // Reinsertar productos
    if (importacion.productos?.length) {
      await supabase.from("importacion_productos").insert(
        importacion.productos.map((p) => ({
          importacion_id: id,
          producto_id: p.producto_id,
          categoria: p.categoria,
          descripcion: p.descripcion,
          cantidad: p.cantidad,
          unidad_medida: p.unidad_medida,
          precio_unitario: p.precio_unitario,
          importe_usd: p.importe_usd,
        }))
      );
    }
  },

  async delete(id: number) {
    const { error } = await supabase.from("importaciones").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // ✅ Crear importación (optimizada)
  async crearImportacion(data: any) {
    const parseNumber = (value: any) => {
      if (value === "" || value === null || value === undefined) return 0;
      return Number(value);
    };

    const mapped = {
      num_dua: data.numImportacion || null,
      fecha_llegada: data.fechaPedido || null,
      fecha_entrega: data.fechaEntrega || null,
      orden_compra: data.purchaseOrder || null,
      detalle: data.detalle || "",
      proveedor: data.proveedor ?? "",
      agente_aduanas: data.agente_aduanas ?? "",
      pais_origen: data.pais_origen ?? "",
      puerto_origen: data.puerto_origen ?? "",
      puerto_destino: data.puerto_destino ?? "",
      container: data.container ?? "",
      factura: data.factura ?? "",
      fecha_vencimiento: data.fecha_vencimiento || null,
      unidad: data.unidad ?? "",
      cantidad: parseNumber(data.cantidad),
      valor_fob_usd: parseNumber(data.valor_fob_usd),
      transporte_maritimo_usd: parseNumber(data.transporte_maritimo_usd),
      valor_cfr_usd: parseNumber(data.valor_cfr_usd),
      liquidacion_moneda: data.liquidacion_moneda ?? "",
      liquidacion_monto: parseNumber(data.liquidacion_monto),
    };

    const { data: inserted, error } = await supabase
      .from("importaciones")
      .insert([mapped])
      .select("id")
      .single();

    if (error) throw error;

    // Adjuntos
    if (data.adjuntos?.length) {
      await supabase.from("importacion_adjuntos").insert(
        data.adjuntos.map((url: string) => ({
          importacion_id: inserted.id,
          url,
          nombre_archivo: url.split("/").pop() || "archivo.pdf",
        }))
      );
    }

    // Productos
    if (data.productos?.length) {
      await supabase.from("importacion_productos").insert(
        data.productos.map((p: any) => ({
          importacion_id: inserted.id,
          producto_id: p.producto_id ?? null,
          categoria: p.categoria ?? "",
          descripcion: p.descripcion ?? "",
          cantidad: parseNumber(p.cantidad),
          unidad_medida: p.unidad_medida ?? "",
          precio_unitario: parseNumber(p.precio_unitario),
          importe_usd: parseNumber(p.importe_usd),
        }))
      );
    }

    return inserted.id;
  },
  async getImportacionesBase() {
    const { data, error } = await supabase
      .from("importacion_productos")
      .select(`
        id,
        producto_id,
        categoria,
        descripcion,
        cantidad,
        unidad_medida,
        precio_unitario,
        importe_usd,
        importaciones (
          id,
          num_dua,
          orden_compra
        )
      `);

    if (error) throw new Error(error.message);
    if (!data) return [];

    // Formateamos para tener un objeto plano
    return data.map((impProd: any) => ({
      id: impProd.id,
      producto_id: impProd.producto_id,
      categoria: impProd.categoria,
      descripcion: impProd.descripcion,
      cantidad: impProd.cantidad,
      unidad_medida: impProd.unidad_medida,
      precio_unitario: impProd.precio_unitario,
      importe_usd: impProd.importe_usd,
      num_dua: impProd.importaciones?.num_dua ?? null,
      orden_compra: impProd.importaciones?.orden_compra ?? null,
    }));
  },

  // =====================================================
  // 2️⃣ Leer productos con materiales asociados
  // =====================================================
  async getProductosBase() {
    const { data, error } = await supabase
      .from("productos")
      .select(`
        id,
        nombre_producto,
        categoria,
        materiales (
          unidad_medida,
          gramaje_g,
          ancho_cm,
          largo_cm,
          peso_kg
        )
      `);

    if (error) throw new Error(error.message);
    if (!data) return [];

    return data.map((p: any) => ({
      id: p.id,
      nombre_producto: p.nombre_producto,
      categoria: p.categoria,
      unidad_medida: p.materiales?.[0]?.unidad_medida ?? "",
      gramaje: p.materiales?.[0]?.gramaje_g ?? 0,
      ancho: p.materiales?.[0]?.ancho_cm ?? 0,
      largo: p.materiales?.[0]?.largo_cm ?? 0,
      peso: p.materiales?.[0]?.peso_kg ?? 0,
    }));
  },

  // =====================================================
  // 3️⃣ Unir ambos resultados para mostrar en Inventario
  // =====================================================
  async getInventarioCompleto() {
    const importaciones = await this.getImportacionesBase();
    const productos = await this.getProductosBase();

    const inventario = importaciones.map((imp) => {
      const prod = productos.find((p) => p.id === imp.producto_id);

      return {
        id: imp.id,
        num_dua: imp.num_dua,
        orden_compra: imp.orden_compra,
        producto_id: imp.producto_id,
        nombre_producto: prod?.nombre_producto ?? "Sin nombre",
        categoria: prod?.categoria ?? "",
        unidad_medida: prod?.unidad_medida ?? imp.unidad_medida ?? "",
        gramaje: prod?.gramaje ?? 0,
        ancho: prod?.ancho ?? 0,
        largo: prod?.largo ?? 0,
        peso: prod?.peso ?? 0,
        precio_min: prod?.precio_min ?? 0,
        precio_max: prod?.precio_max ?? 0,
        moneda: prod?.moneda ?? 0,
        stock_actual: prod?.precio_max ?? 0,
        ubicacion: prod?.precio_max ?? 0,
        cantidad: prod?.precio_max ?? 0,
        precio_unitario: prod?.precio_max ?? 0,
        importe_usd: prod?.precio_max ?? 0,
      };
    });

    return inventario;
  },
  async getComprasBase() {
    const { data, error } = await supabase
      .from("importaciones")
      .select(`
        id,
        num_dua,
        detalle,
        proveedor,
        pais_origen,
        fecha_entrega,
        estado
      `)
      .order("id", { ascending: false });

    if (error) throw new Error(error.message);
    if (!data) return [];

    // Mapeo y formato del estado (entregado o en tránsito)
    return data.map((c: any) => ({
      id: c.id,
      num_dua: c.num_dua,
      detalle: c.detalle ?? "Sin descripción",
      proveedor: c.proveedor ?? "N/A",
      pais_origen: c.pais_origen ?? "N/A",
      estado: c.estado ? "Entregado" : "En tránsito",
      fecha_entrega: c.fecha_entrega ?? null,
    }));
  },
  async getCompraDetailById(id: number) {
    const { data, error } = await supabase
      .from("importaciones")
      .select(`
        id,
        num_dua,
        factura,
        fecha_vencimiento,
        unidad,
        cantidad,
        valor_fob_usd,
        transporte_maritimo_usd,
        valor_cfr_usd,
        liquidacion_moneda,
        liquidacion_monto,
        pais_origen,
        proveedor,
        agente_aduanas,
        importacion_adjuntos (url, nombre_archivo)
      `)
      .eq("id", id)
      .single();

    if (error) throw new Error(error.message);
    if (!data) return null;

    // ✅ Estructuramos los datos al formato que espera CompraDetail
    const compraDetail = {
      id: data.id,
      num_dua: data.num_dua,
      datosEconomicos: {
        factura: data.factura ?? "-",
        fechaVencimiento: data.fecha_vencimiento ?? "-",
        cantidad: data.cantidad ?? 0,
        unidad: data.unidad ?? "",
        valorFOB: data.valor_fob_usd ?? 0,
        transporteMaritimo: data.transporte_maritimo_usd ?? 0,
        valorCFR: data.valor_cfr_usd ?? 0,
        liquidacion: {
          moneda: data.liquidacion_moneda ?? "-",
          monto: data.liquidacion_monto ?? 0,
        },
      },
      datosImportacion: {
        agente: data.agente_aduanas ?? "-",
      },
      logistica: {
        origen: data.pais_origen ?? "-",
      },
      proveedor: {
        nombre: data.proveedor ?? "N/A",
        pais: data.pais_origen ?? "-",
      },
      adjuntos: data.importacion_adjuntos?.map((a: any) => a.url) ?? [],
    };

    return compraDetail;
  },
  async registrarEstadoEntrega(importacionId: number, almacenId: number) {
    const { error } = await supabase.from("estado_importaciones").insert([
      {
        importacion_id: importacionId,
        estado: "Entregado",
        almacen_id: almacenId,
      },
    ]);

    if (error) throw new Error(error.message);

    // Actualizamos la importación
    await supabase
      .from("importaciones")
      .update({ fecha_entrega: new Date().toISOString() })
      .eq("id", importacionId);
  },

  async registrarEstadoCancelacion(importacionId: number, motivo: string) {
    const { error } = await supabase.from("estado_importaciones").insert([
      {
        importacion_id: importacionId,
        estado: "Cancelado",
        motivo_cancelacion: motivo,
      },
    ]);

    if (error) throw new Error(error.message);

    // Actualizamos la importación (sin fecha de entrega)
    await supabase
      .from("importaciones")
      .update({ fecha_entrega: null })
      .eq("id", importacionId);
  },

  async actualizarEstado(
    id: number,
    estado: string,
    opts?: { almacenId?: number; motivo?: string }
  ) {
    // validación de estados permitidos (opcional pero recomendada)
    const estadosValidos = ["Registrado", "En Transito", "Entregado", "Cancelado"];
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido: ${estado}`);
    }

    // 1) Buscar el registro de estado más reciente
    const { data: ultimo, error: selErr } = await supabase
      .from("estado_importaciones")
      .select("id, estado, almacen_id")
      .eq("importacion_id", id)
      .order("fecha_registro", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (selErr) throw new Error(selErr.message);

    // 2) Regla de negocio: no permitir cancelar si ya fue entregado
    if (ultimo?.estado === "Entregado" && estado === "Cancelado") {
      throw new Error("No se puede cambiar a 'Cancelado' una importación que ya fue 'Entregado'.");
    }

    // 3) Preparar payload para update/insert
    const payload: any = { estado };
    if (opts?.almacenId !== undefined) payload.almacen_id = opts.almacenId;
    if (opts?.motivo !== undefined) payload.motivo_cancelacion = opts.motivo;

    if (ultimo && ultimo.id) {
      // 4a) Actualizar el registro existente (no insertar)
      const { error: updErr } = await supabase
        .from("estado_importaciones")
        .update(payload)
        .eq("id", ultimo.id);

      if (updErr) throw new Error(updErr.message);
    } else {
      // 4b) Si no existe registro previo, insertar uno nuevo
      const insertBody = {
        importacion_id: id,
        ...payload,
      };
      const { error: insErr } = await supabase
        .from("estado_importaciones")
        .insert([insertBody]);

      if (insErr) throw new Error(insErr.message);
    }

    // 5) Sincronizar el campo 'estado' en tabla importaciones
    const { error: impErr } = await supabase
      .from("importaciones")
      .update({ estado })
      .eq("id", id);

    if (impErr) throw new Error(impErr.message);

    return true;
  }

};

