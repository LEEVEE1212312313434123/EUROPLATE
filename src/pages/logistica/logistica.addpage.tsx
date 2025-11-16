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

  // -------------------------------------------------------------------
  // Campos principales de la tabla importaciones
  // -------------------------------------------------------------------
  const [datosGenerales, setDatosGenerales] = useState({
    id_importacion: "",      // <-- NUEVO CAMPO
    num_dua: "",
    fecha_llegada: "",
    fecha_entrega: "",
    orden_compra: "",
    detalle: "",
    proveedor: "",
    agente_aduanas: "",
    pais_origen: "",
    puerto_origen: "",
    puerto_destino: "",
    container: "",
    factura: "",
    fecha_vencimiento: "",
    unidad: "",
    cantidad: 0,
    valor_fob_usd: 0,
    transporte_maritimo_usd: 0,
    valor_cfr_usd: 0,
    liquidacion_moneda: "",
    liquidacion_monto: 0
  });

  // Datos adicionales del componente DataImportacion
  const [dataImportacion, setDataImportacion] = useState<any>({});

  // Adjuntos: solo URL + nombre_archivo
  const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);

  // Productos: campos válidos para importacion_productos
  const [productos, setProductos] = useState<any[]>([]);

  // =====================================================================
  // GUARDAR IMPORTACIÓN
  // =====================================================================
  const handleGuardar = async () => {
    if (isSaving) return;
    setIsSaving(true);

    try {
      // 1) VALIDACIÓN
      if (
        !datosGenerales.id_importacion ||
        !datosGenerales.num_dua ||
        !datosGenerales.fecha_llegada ||
        !datosGenerales.orden_compra
      ) {
        toast.error("Completa todos los campos obligatorios.");
        setIsSaving(false);
        return;
      }

      // 2) CONSTRUIR PAYLOAD LIMPIO
      const payload = {
        ...datosGenerales,
        ...dataImportacion,
        productos: productos.map((p) => ({
          producto_id: p.producto_id ?? null,
          categoria: p.categoria ?? "",
          descripcion: p.descripcion ?? "",
          cantidad: Number(p.cantidad) || 0,
          unidad_medida: p.unidadMedida ?? "",
          precio_unitario: Number(p.precioUnitario) || 0,
          importe_usd: Number(p.importeUsd) || 0
        })),
        adjuntos: adjuntos.map((a) => ({
          url: a.url,
          nombre_archivo: a.nombre_archivo,
          created_at: a.created_at ?? new Date().toISOString()
        })),
        estados: [
          {
            estado: "Registrado",
            fecha_registro: new Date().toISOString()
          }
        ]
      };

      console.log("🚀 PAYLOAD ENVIADO:", payload);

      // 3) CREAR IMPORTACIÓN
      const ok = await ImportacionService.crearImportacion(
        payload,
        payload.productos,
        payload.adjuntos,
        payload.estados
      );

      if (!ok) throw new Error("Error al crear importación");

      toast.success("Importación registrada correctamente 🎉");
      setTimeout(() => navigate("/logistica?tab=compras"), 1200);

    } catch (err) {
      console.error("❌ Error al guardar:", err);
      toast.error("Error al guardar la importación.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full">
      {/* BOTONES */}
      <div className="flex justify-end gap-2 p-3 -mt-2">
        <Button
          className="cursor-pointer h-8 px-3 text-sm"
          variant="outline"
          onClick={() => navigate("/logistica?tab=compras")}
          disabled={isSaving}
        >
          Cancelar
        </Button>

        <Button
          className="cursor-pointer h-8 px-3 text-sm"
          onClick={handleGuardar}
          disabled={isSaving}
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </Button>
      </div>

      <hr className="border-gray-200" />

      <div className="p-4">
        <h2 className="text-lg font-semibold">Registrar Importación</h2>

        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">Datos Generales</h3>

          <div className="flex flex-col md:flex-row gap-3">
            {/* ID Importación */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">ID Importación</Label>
              <Input
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.id_importacion}
                onChange={(e) =>
                  setDatosGenerales({ ...datosGenerales, id_importacion: e.target.value })
                }
              />
            </div>

            {/* N° DUA */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">N° DUA</Label>
              <Input
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.num_dua}
                onChange={(e) =>
                  setDatosGenerales({ ...datosGenerales, num_dua: e.target.value })
                }
              />
            </div>

            {/* Fecha Llegada */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Fecha Llegada</Label>
              <Input
                type="date"
                className="h-8 text-xs w-full"
                value={datosGenerales.fecha_llegada}
                onChange={(e) =>
                  setDatosGenerales({ ...datosGenerales, fecha_llegada: e.target.value })
                }
              />
            </div>

            {/* Fecha Entrega */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Fecha Entrega</Label>
              <Input
                type="date"
                className="h-8 text-xs w-full"
                value={datosGenerales.fecha_entrega}
                onChange={(e) =>
                  setDatosGenerales({ ...datosGenerales, fecha_entrega: e.target.value })
                }
              />
            </div>

            {/* Orden Compra */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Orden de Compra</Label>
              <Input
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.orden_compra}
                onChange={(e) =>
                  setDatosGenerales({ ...datosGenerales, orden_compra: e.target.value })
                }
              />
            </div>
          </div>

          {/* Detalle */}
          <div className="flex flex-col space-y-0.5 mt-3 w-full">
            <Label className="text-xs">Detalle</Label>
            <Input
              className="h-10 text-sm md:h-9 md:text-xs w-full"
              value={datosGenerales.detalle}
              onChange={(e) =>
                setDatosGenerales({ ...datosGenerales, detalle: e.target.value })
              }
            />
          </div>

          {/* DataImportacion adicional */}
          <DataImportacion onChange={(d) => setDataImportacion(d)} />

          {/* Adjuntos */}
          <PDFAdjunto
            onChangeFiles={(fs: { url: string; nombre_archivo: string }[]) => {
              const mapped = fs.map(f => ({ ...f, created_at: new Date().toISOString() }));
              setAdjuntos(mapped);
            }}
          />

          {/* Productos */}
          <TableAddImport onChange={(rows) => setProductos(rows)} />
        </div>
      </div>
    </div>
  );
}
