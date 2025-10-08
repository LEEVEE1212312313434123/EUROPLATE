"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DataImportacion({
  onChange,
}: {
  onChange: (data: any) => void;
}) {
  const [data, setData] = useState({
    proveedor: "",
    agente_aduanas: "",
    pais_origen: "",
    puerto_origen: "",
    puerto_destino: "",
    container: "",
    factura: "",
    fecha_vencimiento: "",
    cantidad: "",
    unidad: "",
    valor_fob_usd: "",
    transporte_maritimo_usd: "",
    valor_cfr_usd: "",
    liquidacion_moneda: "usd",
    liquidacion_monto: "",
  });

  const handleChange = (field: string, value: string) => {
    const updated = { ...data, [field]: value };
    setData(updated);
    onChange(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 mt-6">
      {/* DATOS DE LA IMPORTACIÓN */}
      <div>
        <h3 className="text-base font-semibold mb-4">Datos de la Importación</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Proveedor */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="proveedor" className="text-xs">Proveedor</Label>
            <Select
              value={data.proveedor}
              onValueChange={(value) => handleChange("proveedor", value)}
            >
              <SelectTrigger id="proveedor" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CartoneraXYZ">Cartonera XYZ</SelectItem>
                <SelectItem value="Proveedor2">Proveedor 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agente Aduanas */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="agente_aduanas" className="text-xs">Agente de aduanas</Label>
            <Select
              value={data.agente_aduanas}
              onValueChange={(value) => handleChange("agente_aduanas", value)}
            >
              <SelectTrigger id="agente_aduanas" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ebl">EBL Grupo Logístico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* País Origen */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="pais_origen" className="text-xs">País de Origen</Label>
            <Select
              value={data.pais_origen}
              onValueChange={(value) => handleChange("pais_origen", value)}
            >
              <SelectTrigger id="pais_origen" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suecia">Suecia</SelectItem>
                <SelectItem value="china">China</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Puerto Origen */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="puerto_origen" className="text-xs">Puerto Origen</Label>
            <Select
              value={data.puerto_origen}
              onValueChange={(value) => handleChange("puerto_origen", value)}
            >
              <SelectTrigger id="puerto_origen" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shangai">Shangai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Puerto Destino */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="puerto_destino" className="text-xs">Puerto Destino</Label>
            <Select
              value={data.puerto_destino}
              onValueChange={(value) => handleChange("puerto_destino", value)}
            >
              <SelectTrigger id="puerto_destino" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="callao">Callao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Container */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="container" className="text-xs">Container</Label>
            <Input
              id="container"
              placeholder="Container"
              className="h-8 text-xs w-full"
              value={data.container}
              onChange={(e) => handleChange("container", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block border-l border-gray-300"></div>

      {/* DATOS ECONÓMICOS */}
      <div>
        <h3 className="text-base font-semibold mb-4">Datos Económicos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Factura */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="factura" className="text-xs">Factura</Label>
            <Input
              id="factura"
              placeholder="N° Factura"
              className="h-8 text-xs w-full"
              value={data.factura}
              onChange={(e) => handleChange("factura", e.target.value)}
            />
          </div>

          {/* Fecha Vencimiento */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="fecha_vencimiento" className="text-xs">Fecha de vencimiento</Label>
            <Input
              type="date"
              id="fecha_vencimiento"
              className="h-8 text-xs w-full"
              value={data.fecha_vencimiento}
              onChange={(e) => handleChange("fecha_vencimiento", e.target.value)}
            />
          </div>

          {/* Cantidad */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="cantidad" className="text-xs">Cantidad</Label>
            <Input
              id="cantidad"
              placeholder="Cantidad"
              className="h-8 text-xs w-full"
              value={data.cantidad}
              onChange={(e) => handleChange("cantidad", e.target.value)}
            />
          </div>

          {/* Unidad */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="unidad" className="text-xs">Unidad</Label>
            <Select
              value={data.unidad}
              onValueChange={(value) => handleChange("unidad", value)}
            >
              <SelectTrigger id="unidad" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mt">MT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Valor FOB */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor_fob_usd" className="text-xs">Valor FOB (USD)</Label>
            <Input
              id="valor_fob_usd"
              placeholder="0.00"
              className="h-8 text-xs w-full"
              value={data.valor_fob_usd}
              onChange={(e) => handleChange("valor_fob_usd", e.target.value)}
            />
          </div>

          {/* Transporte marítimo */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="transporte_maritimo_usd" className="text-xs">Transporte marítimo (USD)</Label>
            <Input
              id="transporte_maritimo_usd"
              placeholder="0.00"
              className="h-8 text-xs w-full"
              value={data.transporte_maritimo_usd}
              onChange={(e) => handleChange("transporte_maritimo_usd", e.target.value)}
            />
          </div>

          {/* Valor CFR */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor_cfr_usd" className="text-xs">Valor CFR (USD)</Label>
            <Input
              id="valor_cfr_usd"
              placeholder="0.00"
              className="h-8 text-xs w-full"
              value={data.valor_cfr_usd}
              onChange={(e) => handleChange("valor_cfr_usd", e.target.value)}
            />
          </div>

          {/* Liquidación */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="liquidacion_moneda" className="text-xs">Liquidación</Label>
            <div className="flex gap-2">
              <Select
                value={data.liquidacion_moneda}
                onValueChange={(value) => handleChange("liquidacion_moneda", value)}
              >
                <SelectTrigger id="liquidacion_moneda" className="h-8 text-xs w-20">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="pen">S/</SelectItem>
                </SelectContent>
              </Select>
              <Input
                placeholder="0.00"
                className="h-8 text-xs flex-1"
                value={data.liquidacion_monto}
                onChange={(e) => handleChange("liquidacion_monto", e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
