"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import DataImportacion from "@/components/common/Logistica/Data.Importacion";
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt";
import TableAddImport from "@/components/common/Logistica/Table.add";

import { ImportacionService } from "@/services/editimportacion.service";
import type { Importacion, ImportacionProducto, ImportacionAdjunto } from "@/types/editimportacion.type";
import { toast } from "sonner";

export default function EditarLogistica() {
  const location = useLocation();
  const navigate = useNavigate();

  const compra: Importacion | undefined = location.state?.compra;

  // -------------------------------
  //  Estados locales editables
  // -------------------------------
  const [form, setForm] = useState<Importacion | null>(null);
  const [productos, setProductos] = useState<ImportacionProducto[]>([]);
  const [adjuntos, setAdjuntos] = useState<ImportacionAdjunto[]>([]);
  const [estados, setEstados] = useState<any[]>([]);

  useEffect(() => {
    if (compra) {
      setForm(compra);
      setProductos(compra.productos || []);
      setAdjuntos(compra.adjuntos || []);
      setEstados(compra.estados || []);
    }
  }, [compra]);

  if (!form) {
    return (
      <div className="p-4 text-center text-red-500">
        No se encontró la importación a editar.
      </div>
    );
  }

  // -------------------------------
  // HANDLERS
  // -------------------------------
  const handleChange = (field: keyof Importacion, value: any) => {
    setForm((prev) => ({
      ...prev!,
      [field]: value,
    }));
  };

  const handleProductosChange = (rows: any[]) => {
    const mapped: ImportacionProducto[] = rows.map((r) => ({
      id: r.id,
      importacion_id: form!.id,
      producto_id: r.producto_id ?? null,
      categoria: r.categoria,
      descripcion: r.descripcion,
      cantidad: Number(r.cantidad) || 0,
      unidad_medida: r.unidadMedida,
      precio_unitario: Number(r.precioUnitario) || 0,
      importe_usd: Number(r.importeUsd) || 0,
    }));

    setProductos(mapped);
  };

  const handleCancelar = async () => {
    if (!form) return;
    navigate("/logistica");
  };

  const handleGuardar = async () => {
    if (!form) return;

    const success = await ImportacionService.updateImportacion(
      form.id,
      form,        // datos generales editados
      productos,   // productos actualizados
      adjuntos,    // adjuntos actualizados
      estados      // estados actualizados
    );

    if (success) {
      toast.success("Importación actualizada correctamente.");
      navigate("/logistica");
    } else {
      alert("Error al actualizar la importación.");
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 p-3 -mt-2">
        <Button onClick={handleCancelar} className="cursor-pointer h-8 px-3 text-sm" variant="outline">
          Cancelar
        </Button>
        <Button onClick={handleGuardar} className="cursor-pointer h-8 px-3 text-sm">
          Guardar Cambios
        </Button>
      </div>

      <hr className="border-gray-200" />

      <div className="p-4">
        <h2 className="text-lg font-semibold">Editar Importación</h2>

        {/* DATOS GENERALES */}
        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">Datos Generales</h3>

          <div className="flex flex-col md:flex-row gap-3">
            {/* ID Importación */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">ID Importación</Label>
              <Input
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={form.id_importacion || ""}
                onChange={(e) => handleChange("id_importacion", e.target.value)}
              />
            </div>

            {/* N° DUA */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="num-importacion" className="text-xs">N° DUA</Label>
              <Input
                id="num-importacion"
                value={form.num_dua}
                onChange={(e) => handleChange("num_dua", e.target.value)}
                className="h-10 text-sm md:h-9 md:text-xs w-full"
              />
            </div>

            {/* Fecha Llegada */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Fecha Llegada</Label>
              <Input
                type="date"
                value={form.fecha_llegada}
                onChange={(e) => handleChange("fecha_llegada", e.target.value)}
                className="h-8 text-xs w-full"
              />
            </div>

            {/* Fecha Entrega */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Fecha Entrega</Label>
              <Input
                type="date"
                value={form.fecha_entrega || ""}
                onChange={(e) => handleChange("fecha_entrega", e.target.value)}
                className="h-8 text-xs w-full"
              />
            </div>

            {/* Orden Compra */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label className="text-xs">Orden de Compra</Label>
              <Input
                value={form.orden_compra || ""}
                onChange={(e) => handleChange("orden_compra", e.target.value)}
                className="h-10 text-sm md:h-9 md:text-xs w-full"
              />
            </div>
          </div>

          {/* Detalle */}
          <div className="flex flex-col space-y-0.5 mt-3 w-full">
            <Label className="text-xs">Detalle</Label>
            <Input
              value={form.detalle || ""}
              onChange={(e) => handleChange("detalle", e.target.value)}
              className="h-10 text-sm md:h-9 md:text-xs w-full"
            />
          </div>

          {/* DATOS DE IMPORTACIÓN */}
          <DataImportacion
            importacion={form}
            onChange={(dataActualizada) => setForm((prev) => ({ ...prev!, ...dataActualizada }))}
          />

          {/* ADJUNTOS */}
          <div className="mt-4">
            <PDFAdjunto
              initialFiles={adjuntos.map((a) => ({
                url: a.url,
                nombre_archivo: a.nombre_archivo
              }))}
              onChangeFiles={(files) => {
                const nuevos = files.map((f) => ({
                  url: f.url,
                  nombre_archivo: f.nombre_archivo,
                  importacion_id: form.id
                }));
                setAdjuntos(nuevos);
              }}
            />
          </div>

          {/* PRODUCTOS */}
          <div className="mt-4">
            <TableAddImport
              initialData={productos.map((p, index) => ({
                tempId: index + 1,
                id: p.id,
                producto_id: p.producto_id,
                categoria: p.categoria,
                descripcion: p.descripcion,
                cantidad: String(p.cantidad),
                unidadMedida: p.unidad_medida,
                precioUnitario: String(p.precio_unitario),
                importeUsd: String(p.importe_usd),
              }))}
              onChange={handleProductosChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
