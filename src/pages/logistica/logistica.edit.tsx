"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DataImportacion from "@/components/common/Logistica/Data.Importacion"
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt"
import TableAddImport from "@/components/common/Logistica/Table.add"

export default function EditarLogistica() {
  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 p-3 -mt-2">
        <Button className="cursor-pointer h-8 px-3 text-sm" variant="outline">
          Cancelar
        </Button>
        <Button className="cursor-pointer h-8 px-3 text-sm">
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
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="num-importacion" className="text-xs">
                N° DUA
              </Label>
              <Input
                id="num-importacion"
                placeholder="N°"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
              />
            </div>

            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-pedido" className="text-xs">
                Fecha Llegada
              </Label>
              <Input
                type="date"
                id="fecha-pedido"
                className="h-8 text-xs w-full"
              />
            </div>

            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-entrega" className="text-xs">
                Fecha Entrega
              </Label>
              <Input
                type="date"
                id="fecha-entrega"
                className="h-8 text-xs w-full"
              />
            </div>

            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="purchase-order" className="text-xs">
                Orden de Compra
              </Label>
              <Input
                id="purchase-order"
                placeholder="Ingrese el Orden"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
              />
            </div>
          </div>

          <div className="flex flex-col space-y-0.5 mt-3 w-full">
            <Label htmlFor="detalle" className="text-xs">
              Detalle
            </Label>
            <Input
              id="detalle"
              placeholder="Importación"
              className="h-10 text-sm md:h-9 md:text-xs w-full"
            />
          </div>

          {/* COMPONENTES REUTILIZADOS */}
          <div className="mt-4">
            <DataImportacion onChange={() => {}} />
          </div>

          <div className="mt-4">
            <PDFAdjunto />
          </div>

          <div className="mt-4">
            <TableAddImport onChange={() => {}} />
          </div>
        </div>
      </div>
    </div>
  )
}
