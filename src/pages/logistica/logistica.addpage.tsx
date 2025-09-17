import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DataImportacion from "@/components/common/Logistica/Data.Importacion"
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt"
import TableAddImport from "@/components/common/Logistica/Table.add"

export default function AgregarLogistica() {
  return (
    <div className="w-full">
      <div className="flex justify-end gap-2 p-3 -mt-2">
        <Button className="cursor-pointer h-8 px-3 text-sm" variant="outline">
          Cancelar
        </Button>
        <Button className="cursor-pointer h-8 px-3 text-sm">Guardar</Button>
      </div>

      <hr className="border-gray-200" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">Registrar Importación</h2>
        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">Datos Generales</h3>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="num-importacion" className="text-xs">
                N° Importación
              </Label>
              <Input
                id="num-importacion"
                placeholder="N°"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
              />
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-pedido" className="text-xs">
                Fecha Pedido
              </Label>
              <Select>
                <SelectTrigger
                  id="fecha-pedido"
                  className="h-10 text-sm md:h-7 md:text-xs w-full"
                >
                  <SelectValue placeholder="Pedido" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-09-01">01/09/2025</SelectItem>
                  <SelectItem value="2025-09-10">10/09/2025</SelectItem>
                  <SelectItem value="2025-09-20">20/09/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-entrega" className="text-xs">
                Fecha Entrega
              </Label>
              <Select>
                <SelectTrigger
                  id="fecha-entrega"
                  className="h-10 text-sm md:h-7 md:text-xs w-full"
                >
                  <SelectValue placeholder="Entrega" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2025-10-01">01/10/2025</SelectItem>
                  <SelectItem value="2025-10-15">15/10/2025</SelectItem>
                  <SelectItem value="2025-10-30">30/10/2025</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="purchase-order" className="text-xs">
                Purchase Order
              </Label>
              <Input
                id="purchase-order"
                placeholder="Orden"
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
          <DataImportacion />
          <PDFAdjunto />
          <TableAddImport/>
        </div>
      </div>
    </div>
  )
}
