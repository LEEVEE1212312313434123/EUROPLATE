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
    const [datosGenerales, setDatosGenerales] = useState({
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

    const [dataImportacion, setDataImportacion] = useState<any>({});
    const [adjuntos, setAdjuntos] = useState<Adjunto[]>([]);
    const [productos, setProductos] = useState<any[]>([]);
    const handleGuardar = async () => {
      if (isSaving) return;
      setIsSaving(true);

      try {
        if (
          !datosGenerales.num_dua ||
          !datosGenerales.fecha_llegada ||
          !datosGenerales.orden_compra
        ) {
          toast.error("Completa los campos obligatorios.");
          return;
        }

        const payload = {
          ...datosGenerales,
          ...dataImportacion,
          estado: "Entregado",
          productos: productos.map(p => ({
            producto_id: p.producto_id ?? null,
            categoria: p.categoria ?? "",
            descripcion: p.descripcion ?? "",
            cantidad: Number(p.cantidad) || 0,
            unidad_medida: p.unidadMedida ?? "",
            precio_unitario: Number(p.precioUnitario) || 0,
            importe_usd: Number(p.importeUsd) || 0
          })),
          adjuntos: adjuntos.map(a => ({
            url: a.url,
            nombre_archivo: a.nombre_archivo,
            created_at: a.created_at ?? new Date().toISOString()
          })),
          estados: [
            {
              estado: "Entregado",
              fecha_registro: new Date().toISOString()
            }
          ]
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
                <Label>N° DUA</Label>
                <Input
                  value={datosGenerales.num_dua}
                  onChange={e =>
                    setDatosGenerales({ ...datosGenerales, num_dua: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Fecha Llegada</Label>
                <Input
                  type="date"
                  value={datosGenerales.fecha_llegada}
                  onChange={e =>
                    setDatosGenerales({ ...datosGenerales, fecha_llegada: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Fecha Entrega</Label>
                <Input
                  type="date"
                  value={datosGenerales.fecha_entrega}
                  onChange={e =>
                    setDatosGenerales({ ...datosGenerales, fecha_entrega: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Orden Compra</Label>
                <Input
                  value={datosGenerales.orden_compra}
                  onChange={e =>
                    setDatosGenerales({ ...datosGenerales, orden_compra: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label>Detalle</Label>
              <Input
                value={datosGenerales.detalle}
                onChange={e =>
                  setDatosGenerales({ ...datosGenerales, detalle: e.target.value })
                }
              />
            </div>

            <DataImportacion onChange={setDataImportacion} />
            <PDFAdjunto onChangeFiles={setAdjuntos} />
            <TableAddImport onChange={setProductos} />
          </div>
        </div>
      </div>
    );
  }
