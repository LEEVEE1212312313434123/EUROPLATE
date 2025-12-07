"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Importacion } from "@/types/editimportacion.type";

export interface DataImportacionProps {
  importacion?: Importacion;
  onChange: (data: Partial<Importacion>) => void;
}

// 🔹 Permitir valor libre si no está en la lista
const ensureOptionExists = (options: string[], value?: string) => {
  if (!value) return options;
  if (!options.includes(value)) return [value, ...options];
  return options;
};

export default function DataImportacion({
  importacion,
  onChange,
}: DataImportacionProps) {
  const [localData, setLocalData] = useState<Partial<Importacion>>({
    proveedor: "",
    agente_aduanas: "",
    pais_origen: "",
    puerto_origen: "",
    puerto_destino: "",
    container: "",
    factura: "",
    fecha_vencimiento: "",
    cantidad: 0,
    unidad: "",
    valor_fob_usd: 0,
    transporte_maritimo_usd: 0,
    valor_cfr_usd: 0,
    liquidacion_moneda: "usd",
    liquidacion_monto: 0,
  });

  // 🔥 CORRECCIÓN: solo se ejecuta cuando el ID cambia (o al cargar por primera vez)
  useEffect(() => {
    if (!importacion) return;

    setLocalData((prev) => {
      // Si ya cargamos esta misma importación → no volver a cargarla
      if (prev.id === importacion.id) return prev;

      return {
        ...prev,
        ...importacion,
      };
    });
  }, [importacion?.id]);

  const handleChange = (field: keyof Importacion, value: any) => {
    const updatedData = { ...localData, [field]: value };
    setLocalData(updatedData);
    onChange(updatedData); // 🔥 seguro: ya no re-ejecuta el useEffect
  };

  // 🔹 Opciones estáticas
  const proveedorOpts = ["CartoneraXYZ", "Proveedor2"];
  const agenteOpts = ["ebl"];
  const paisesOpts = ["Brazil", "China"];
  const puertoOrigenOpts = ["Puerto Santos"];
  const puertoDestinoOpts = ["Callao"];
  const unidadOpts = ["Paquete", "MT"];
  const monedaOpts = ["usd", "pen"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 mt-6">
      <div>
        <h3 className="text-base font-semibold mb-4">Datos de la Importación</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Proveedor */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Proveedor</Label>
            <Select
              value={localData.proveedor}
              onValueChange={(value) => handleChange("proveedor", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(proveedorOpts, localData.proveedor).map(
                  (p, i) => (
                    <SelectItem key={i} value={p}>
                      {p}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Agente */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Agente de Aduanas</Label>
            <Select
              value={localData.agente_aduanas}
              onValueChange={(value) => handleChange("agente_aduanas", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar agente" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(agenteOpts, localData.agente_aduanas).map(
                  (p, i) => (
                    <SelectItem key={i} value={p}>
                      {p}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* País origen */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">País de Origen</Label>
            <Select
              value={localData.pais_origen}
              onValueChange={(value) => handleChange("pais_origen", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(paisesOpts, localData.pais_origen).map(
                  (p, i) => (
                    <SelectItem key={i} value={p}>
                      {p}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Puerto origen */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Puerto Origen</Label>
            <Select
              value={localData.puerto_origen}
              onValueChange={(value) => handleChange("puerto_origen", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(
                  puertoOrigenOpts,
                  localData.puerto_origen
                ).map((p, i) => (
                  <SelectItem key={i} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Puerto destino */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Puerto Destino</Label>
            <Select
              value={localData.puerto_destino}
              onValueChange={(value) => handleChange("puerto_destino", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(
                  puertoDestinoOpts,
                  localData.puerto_destino
                ).map((p, i) => (
                  <SelectItem key={i} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Container */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Container</Label>
            <Input
              className="h-8 text-xs"
              value={localData.container}
              onChange={(e) => handleChange("container", e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="hidden md:block border-l border-gray-300" />

      {/* Datos económicos */}
      <div>
        <h3 className="text-base font-semibold mb-4">Datos Económicos</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Factura */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Factura</Label>
            <Input
              className="h-8 text-xs"
              value={localData.factura}
              onChange={(e) => handleChange("factura", e.target.value)}
            />
          </div>

          {/* Fecha */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Fecha de Vencimiento</Label>
            <Input
              type="date"
              className="h-8 text-xs"
              value={localData.fecha_vencimiento}
              onChange={(e) =>
                handleChange("fecha_vencimiento", e.target.value)
              }
            />
          </div>

          {/* Cantidad */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Cantidad</Label>
            <Input
              className="h-8 text-xs"
              value={localData.cantidad}
              onChange={(e) => handleChange("cantidad", Number(e.target.value))}
            />
          </div>

          {/* Unidad */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Unidad</Label>
            <Select
              value={localData.unidad}
              onValueChange={(value) => handleChange("unidad", value)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Seleccionar unidad" />
              </SelectTrigger>
              <SelectContent>
                {ensureOptionExists(unidadOpts, localData.unidad).map(
                  (p, i) => (
                    <SelectItem key={i} value={p}>
                      {p}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* FOB */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Valor FOB (USD)</Label>
            <Input
              className="h-8 text-xs"
              value={localData.valor_fob_usd}
              onChange={(e) =>
                handleChange("valor_fob_usd", Number(e.target.value))
              }
            />
          </div>

          {/* Marítimo */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Transporte Marítimo (USD)</Label>
            <Input
              className="h-8 text-xs"
              value={localData.transporte_maritimo_usd}
              onChange={(e) =>
                handleChange("transporte_maritimo_usd", Number(e.target.value))
              }
            />
          </div>

          {/* CFR */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Valor CFR (USD)</Label>
            <Input
              className="h-8 text-xs"
              value={localData.valor_cfr_usd}
              onChange={(e) =>
                handleChange("valor_cfr_usd", Number(e.target.value))
              }
            />
          </div>

          {/* Liquidación */}
          <div className="flex flex-col space-y-1">
            <Label className="text-xs">Liquidación</Label>
            <div className="flex gap-2">
              <Select
                value={localData.liquidacion_moneda}
                onValueChange={(value) =>
                  handleChange("liquidacion_moneda", value)
                }
              >
                <SelectTrigger className="h-8 text-xs w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ensureOptionExists(
                    monedaOpts,
                    localData.liquidacion_moneda
                  ).map((p, i) => (
                    <SelectItem key={i} value={p}>
                      {p.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                className="h-8 text-xs flex-1"
                value={localData.liquidacion_monto}
                onChange={(e) =>
                  handleChange("liquidacion_monto", Number(e.target.value))
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
