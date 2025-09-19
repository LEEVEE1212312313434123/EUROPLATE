// src/components/common/Logistica/Data.Importacion.tsx

"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Props {
  onChangeImport: (data: any) => void
  onChangeEconomico: (data: any) => void
}

export default function DataImportacion({ onChangeImport, onChangeEconomico }: Props) {
  const [importacion, setImportacion] = useState({
    proveedor: "",
    agente: "",
    origen: "",
    destino: "",
    puertoOrigen: "",
    puertoDestino: "",
    transportista: "",
    aseguradora: "",
    container: "",
  })

  const [economicos, setEconomicos] = useState({
    factura: "",
    fechaVencimiento: "",
    cantidad: "",
    unidad: "",
    valorFOB: "",
    transporteMaritimo: "",
    valorCFR: "",
    liquidacion: { moneda: "", monto: "" },
  })

  // 🔄 Disparamos cambios al padre
  useEffect(() => {
    onChangeImport(importacion)
  }, [importacion])

  useEffect(() => {
    onChangeEconomico(economicos)
  }, [economicos])

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
              onValueChange={(value) => setImportacion({ ...importacion, proveedor: value })}
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

          {/* Agente */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="agente" className="text-xs">Agente de aduanas</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, agente: value })}
            >
              <SelectTrigger id="agente" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ebl">EBL Grupo Logistico</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Origen */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="origen" className="text-xs">País de Origen</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, origen: value })}
            >
              <SelectTrigger id="origen" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suecia">Suecia</SelectItem>
                <SelectItem value="china">China</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Destino */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="destino" className="text-xs">País de Destino</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, destino: value })}
            >
              <SelectTrigger id="destino" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="peru">Perú</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Puerto Origen */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="puerto-origen" className="text-xs">Puerto Origen</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, puertoOrigen: value })}
            >
              <SelectTrigger id="puerto-origen" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shangai">Shangai</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Puerto Destino */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="puerto-destino" className="text-xs">Puerto Destino</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, puertoDestino: value })}
            >
              <SelectTrigger id="puerto-destino" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar puerto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="callao">Callao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transportista */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="transportista" className="text-xs">Transportista</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, transportista: value })}
            >
              <SelectTrigger id="transportista" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beate">Beate 4455 Gothenburg</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Aseguradora */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="aseguradora" className="text-xs">Aseguradora</Label>
            <Select
              onValueChange={(value) => setImportacion({ ...importacion, aseguradora: value })}
            >
              <SelectTrigger id="aseguradora" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anova">Anova Marine Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Container */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="container" className="text-xs">Container</Label>
            <Input
              id="container"
              value={importacion.container}
              onChange={(e) => setImportacion({ ...importacion, container: e.target.value })}
              placeholder="container"
              className="h-8 text-xs w-full"
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
          <div className="flex flex-col space-y-1">
            <Label htmlFor="factura" className="text-xs">Factura</Label>
            <Input
              id="factura"
              value={economicos.factura}
              onChange={(e) => setEconomicos({ ...economicos, factura: e.target.value })}
              placeholder="N° Factura"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="fecha-vencimiento" className="text-xs">Fecha de vencimiento</Label>
            <Input
              type="date"
              id="fecha-vencimiento"
              value={economicos.fechaVencimiento}
              onChange={(e) => setEconomicos({ ...economicos, fechaVencimiento: e.target.value })}
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="cantidad" className="text-xs">Cantidad</Label>
            <Input
              id="cantidad"
              value={economicos.cantidad}
              onChange={(e) => setEconomicos({ ...economicos, cantidad: e.target.value })}
              placeholder="Cantidad"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="unidad" className="text-xs">Unidad</Label>
            <Select
              onValueChange={(value) => setEconomicos({ ...economicos, unidad: value })}
            >
              <SelectTrigger id="unidad" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mt">MT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor-fob" className="text-xs">Valor FOB (USD)</Label>
            <Input
              id="valor-fob"
              value={economicos.valorFOB}
              onChange={(e) => setEconomicos({ ...economicos, valorFOB: e.target.value })}
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="transporte" className="text-xs">Transporte marítimo (USD)</Label>
            <Input
              id="transporte"
              value={economicos.transporteMaritimo}
              onChange={(e) => setEconomicos({ ...economicos, transporteMaritimo: e.target.value })}
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor-cfr" className="text-xs">Valor CFR (USD)</Label>
            <Input
              id="valor-cfr"
              value={economicos.valorCFR}
              onChange={(e) => setEconomicos({ ...economicos, valorCFR: e.target.value })}
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="liquidacion" className="text-xs">Liquidación</Label>
            <div className="flex gap-2">
              <Select
                onValueChange={(value) =>
                  setEconomicos({ ...economicos, liquidacion: { ...economicos.liquidacion, moneda: value } })
                }
              >
                <SelectTrigger id="liquidacion" className="h-8 text-xs w-20">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="pen">S/</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="monto-liquidacion"
                value={economicos.liquidacion.monto}
                onChange={(e) =>
                  setEconomicos({ ...economicos, liquidacion: { ...economicos.liquidacion, monto: e.target.value } })
                }
                placeholder="0.00"
                className="h-8 text-xs flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
