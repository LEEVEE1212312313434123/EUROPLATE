"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataImportacion from "@/components/common/Logistica/Data.Importacion";
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt";
import TableAddImport from "@/components/common/Logistica/Table.add";
import { ImportacionService } from "@/services/editimportacion.service";
import { toast } from "sonner";

type Adjunto = {
  url: string;
  nombre_archivo: string;
  created_at?: string;
};

export default function AgregarLogistica() {
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [triggerValidate, setTriggerValidate] = useState(false);


  const [datosGenerales, setDatosGenerales] = useState({
    num_dua: "",
    fecha_llegada: "",
    fecha_entrega: "",
    orden_compra: "",
    detalle: "",
  });

  const [dataImportacion, setDataImportacion] = useState<any>({});
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
  const [productos, setProductos] = useState<any[]>([]);

  const validarCampos = () => {
    const newErrors: Record<string, string> = {};

    if (!productos.length) {
      toast.error("Debes agregar al menos un producto");
      return false;
    }

    for (const p of productos) {
      if (
        !p.sucursal_id ||
        !p.categoria ||
        !p.descripcion ||
        !p.cantidad ||
        Number(p.cantidad) <= 0 ||
        !p.unidadMedida ||
        !p.precioUnitario ||
        Number(p.precioUnitario) <= 0
      ) {
        toast.error("Completa correctamente los campos de los productos.");
        return false;
      }
    }

    /* =========================
       VALIDACIÓN DATOS GENERALES
    ========================== */

    if (!datosGenerales.num_dua.trim())
      newErrors.num_dua = "El N° DUA es obligatorio";

    if (!datosGenerales.orden_compra.trim())
      newErrors.orden_compra = "La Orden de Compra es obligatoria";

    /* =========================
       VALIDACIÓN DATA IMPORTACIÓN
    ========================== */

    if (!dataImportacion.proveedor?.trim())
      newErrors.proveedor = "El proveedor es obligatorio";

    if (!dataImportacion.agente_aduanas?.trim())
      newErrors.agente_aduanas = "El agente de aduanas es obligatorio";

    if (!dataImportacion.pais_origen?.trim())
      newErrors.pais_origen = "El país de origen es obligatorio";

    if (!dataImportacion.puerto_origen?.trim())
      newErrors.puerto_origen = "El puerto de origen es obligatorio";

    if (!dataImportacion.puerto_destino?.trim())
      newErrors.puerto_destino = "El puerto de destino es obligatorio";

    if (!dataImportacion.unidad?.trim())
      newErrors.unidad = "La unidad es obligatoria";

    if (!dataImportacion.factura?.trim())
      newErrors.factura = "La factura es obligatoria";

    if (dataImportacion.cantidad === undefined || dataImportacion.cantidad <= 0)
      newErrors.cantidad = "La cantidad debe ser mayor a 0";

    if (dataImportacion.valor_fob_usd === undefined || dataImportacion.valor_fob_usd < 0)
      newErrors.valor_fob_usd = "Valor FOB inválido";

    if (dataImportacion.transporte_maritimo_usd === undefined || dataImportacion.transporte_maritimo_usd < 0)
      newErrors.transporte_maritimo_usd = "Transporte inválido";

    if (dataImportacion.valor_cfr_usd === undefined || dataImportacion.valor_cfr_usd < 0)
      newErrors.valor_cfr_usd = "Valor CFR inválido";

    if (dataImportacion.liquidacion_monto === undefined || dataImportacion.liquidacion_monto < 0)
      newErrors.liquidacion_monto = "Liquidación inválida";

    /* ========================= */

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Completa los campos obligatorios correctamente.");
      return false;
    }

    return true;
  };

  const handleGuardar = async () => {
    if (isSaving) return;
    setTriggerValidate(true);
    if (!validarCampos()) return;

    setIsSaving(true);

    try {
      const payload = {
        ...datosGenerales,
        fecha_llegada: datosGenerales.fecha_llegada || null,
        fecha_entrega: datosGenerales.fecha_entrega || null,
        fecha_vencimiento: dataImportacion.fecha_vencimiento || null,
        ...dataImportacion,
        estado: "Entregado",
        productos: productos.map((p) => ({
          producto_id: p.producto_id ?? null,
          sucursal_id: p.sucursal_id ?? null,
          categoria: p.categoria ?? "",
          descripcion: p.descripcion ?? "",
          cantidad: Number(p.cantidad) || 0,
          unidad_medida: p.unidadMedida ?? "",
          precio_unitario: Number(p.precioUnitario) || 0,
          importe_usd: Number(p.importeUsd) || 0,
        })),
        adjuntos: adjuntos.map((a) => ({
          url: a.url,
          nombre_archivo: a.nombre_archivo,
          created_at: a.created_at ?? new Date().toISOString(),
        })),
        estados: [
          {
            estado: "Entregado",
            fecha_registro: new Date().toISOString(),
          },
        ],
      };

      console.log("🚀 PAYLOAD ENVIADO:", payload);

      const ok = await ImportacionService.crearImportacion(
        payload,
        payload.productos,
        payload.adjuntos,
        payload.estados
      );

      if (!ok) throw new Error("Error al crear importación");

      toast.success("Importación registrada correctamente 🎉");
      setTimeout(() => navigate("/logistica?tab=compras"), 1200);
    } catch (error) {
      console.error("❌ Error al guardar:", error);
      toast.error("Error al guardar la importación");
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = (field: string) =>
    errors[field] ? "border-red-500" : "";

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 p-3">
        <Button
          variant="outline"
          disabled={isSaving}
          onClick={() => navigate("/logistica?tab=compras")}
        >
          Cancelar
        </Button>

        <Button disabled={isSaving} onClick={handleGuardar}>
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <hr />

      <div className="p-4">
        <h2 className="text-lg font-semibold">Registrar Importación</h2>

        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <Label>N° DUA *</Label>
              <Input
                className={inputClass("num_dua")}
                value={datosGenerales.num_dua}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    num_dua: e.target.value,
                  })
                }
              />
              {errors.num_dua && (
                <p className="text-red-500 text-sm">{errors.num_dua}</p>
              )}
            </div>

            <div>
              <Label>Fecha Llegada</Label>
              <Input
                type="date"
                value={datosGenerales.fecha_llegada}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    fecha_llegada: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Fecha Entrega</Label>
              <Input
                type="date"
                value={datosGenerales.fecha_entrega}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    fecha_entrega: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <Label>Orden Compra *</Label>
              <Input
                className={inputClass("orden_compra")}
                value={datosGenerales.orden_compra}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    orden_compra: e.target.value,
                  })
                }
              />
              {errors.orden_compra && (
                <p className="text-red-500 text-sm">{errors.orden_compra}</p>
              )}
            </div>
          </div>

          {/* 🔥 Aquí pasamos los errores al componente */}
          <DataImportacion
            onChange={setDataImportacion}
            errors={errors}
          />

          <PDFAdjunto onChangeFiles={setAdjuntos} />
          <TableAddImport onChange={setProductos} triggerValidate={triggerValidate} />
        </div>
      </div>
    </div>
  );
}
