// src/components/common/Logistica/Data.Importacion.tsx

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function DataImportacion() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 mt-6">
      {/* DATOS DE LA IMPORTACIÓN */}
      <div>
        <h3 className="text-base font-semibold mb-4">
          Datos de la Importación
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Proveedor */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="proveedor" className="text-xs">
              Proveedor
            </Label>
            <Select>
              <SelectTrigger id="proveedor" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cartonera">Cartonera XYZ</SelectItem>
                <SelectItem value="proveedor2">Proveedor 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agente */}
          <div className="flex flex-col space-y-1">
            <Label htmlFor="agente" className="text-xs">
              Agente de aduanas
            </Label>
            <Select>
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
            <Label htmlFor="origen" className="text-xs">
              País de Origen
            </Label>
            <Select>
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
            <Label htmlFor="destino" className="text-xs">
              País de Destino
            </Label>
            <Select>
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
            <Label htmlFor="puerto-origen" className="text-xs">
              Puerto Origen
            </Label>
            <Select>
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
            <Label htmlFor="puerto-destino" className="text-xs">
              Puerto Destino
            </Label>
            <Select>
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
            <Label htmlFor="transportista" className="text-xs">
              Transportista
            </Label>
            <Select>
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
            <Label htmlFor="aseguradora" className="text-xs">
              Aseguradora
            </Label>
            <Select>
              <SelectTrigger id="aseguradora" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anova">Anova Marine Insurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="hidden md:block border-l border-gray-300"></div>
      <div>
        <h3 className="text-base font-semibold mb-4">Datos Económicos</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col space-y-1">
            <Label htmlFor="factura" className="text-xs">
              Factura
            </Label>
            <Input
              id="factura"
              placeholder="N° Factura"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="fecha-vencimiento" className="text-xs">
              Fecha de vencimiento
            </Label>
            <Input
              type="date"
              id="fecha-vencimiento"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="cantidad" className="text-xs">
              Cantidad
            </Label>
            <Input
              id="cantidad"
              placeholder="Cantidad"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="unidad" className="text-xs">
              Unidad
            </Label>
            <Select>
              <SelectTrigger id="unidad" className="h-8 text-xs w-full">
                <SelectValue placeholder="Seleccionar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mt">MT</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor-fob" className="text-xs">
              Valor FOB (USD)
            </Label>
            <Input
              id="valor-fob"
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="transporte" className="text-xs">
              Transporte marítimo (USD)
            </Label>
            <Input
              id="transporte"
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="valor-cfr" className="text-xs">
              Valor CFR (USD)
            </Label>
            <Input
              id="valor-cfr"
              placeholder="0.00"
              className="h-8 text-xs w-full"
            />
          </div>

          <div className="flex flex-col space-y-1">
            <Label htmlFor="liquidacion" className="text-xs">
              Liquidación
            </Label>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger id="liquidacion" className="h-8 text-xs w-20">
                  <SelectValue placeholder="USD" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD</SelectItem>
                  <SelectItem value="pen">S/</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="liquidacion"
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
