import type { Compra, Producto } from "@/types/logistica.types";
import type { OrdenImportacion } from "@/types/ImportacionLogistica.types";
import { obtenerImportaciones } from "@/services/LogisticaImportacion.service";

function mapearProductos(raw: any[]): Producto[] {
    return raw.map((p) => ({
        producto_id: p.productId,
        container: p.container || "N/A",
        order: p.order,
        purchase_order: p.purchaseOrder || "N/A",
        seal: p.seal || "N/A",
        estado: "Pendiente",
        material: {
            grade: p.gradeTypeWidthGsm,
            tipo: "Bobina",
            dimensiones: { ancho_mm: 0 },
            gramaje_gsm: 0,
            longitud_m: parseFloat(p.lMetre || "0"),
            peso_bruto_kg: parseFloat(p.grossNetWt || "0"),
        },
    }));
}

export function obtenerComprasAdaptadas(): Compra[] {
    const data: OrdenImportacion[] = obtenerImportaciones() || [];

    return data.map((orden) => ({
        importacion_id: orden.datosGenerales.numImportacion,
        tipo: "importación",
        descripcion: orden.datosGenerales.detalle,
        proveedor: { nombre: orden.datosImportacion.proveedor, pais: orden.datosImportacion.origen || "N/A" },
        logistica: {
            origen: orden.datosImportacion.origen,
            destino: orden.datosImportacion.destino,
            estado: "Pendiente",
            fecha_entrega: orden.datosGenerales.fechaEntrega,
        },
        productos: mapearProductos(orden.productos || []),
        fecha_registro: orden.datosGenerales.fechaPedido,
        accion: "Ver",

        // 🔹 Agregamos TODOS los datos completos
        datosGenerales: orden.datosGenerales,
        datosImportacion: orden.datosImportacion,
        datosEconomicos: orden.datosEconomicos,
        adjuntos: orden.adjuntos || [],
    }));
}
