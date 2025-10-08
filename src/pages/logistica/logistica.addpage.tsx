"use client"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DataImportacion from "@/components/common/Logistica/Data.Importacion"
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt"
import TableAddImport from "@/components/common/Logistica/Table.add"
import { ImportacionService } from "@/services/logistica.importacion.service"
import { toast } from "sonner"

export default function AgregarLogistica() {
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const [datosGenerales, setDatosGenerales] = useState({
    numImportacion: "",
    fechaPedido: "",
    fechaEntrega: "",
    purchaseOrder: "",
    detalle: "",
  })

  const [dataImportacion, setDataImportacion] = useState<any>({})
  const [adjuntos, setAdjuntos] = useState<string[]>([])
  const [productos, setProductos] = useState<any[]>([])

  const handleGuardar = async () => {
    if (isSaving) return // evita doble clic
    setIsSaving(true)

    try {
      // validación básica
      if (
        !datosGenerales.numImportacion ||
        !datosGenerales.fechaPedido ||
        !datosGenerales.purchaseOrder
      ) {
        toast.error("Completa todos los campos obligatorios.")
        setIsSaving(false)
        return
      }

      const dataFinal = {
        ...datosGenerales,
        ...dataImportacion,
        adjuntos,
        productos,
      }

      await ImportacionService.crearImportacion(dataFinal)
      toast.success("Importación registrada correctamente 🎉")

      // redirigir luego de 1 segundo para permitir mostrar el toast
      setTimeout(() => {
        navigate("/logistica?tab=compras")
      }, 1000)
    } catch (err) {
      console.error(err)
      toast.error("Error al guardar la importación.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="w-full">
      {/* Botones superiores */}
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
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="num-importacion" className="text-xs">N° DUA</Label>
              <Input
                id="num-importacion"
                placeholder="N°"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.numImportacion}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    numImportacion: e.target.value,
                  })
                }
              />
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-pedido" className="text-xs">Fecha Llegada</Label>
              <Input
                type="date"
                id="fecha-pedido"
                value={datosGenerales.fechaPedido}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    fechaPedido: e.target.value,
                  })
                }
                className="h-8 text-xs w-full"
              />
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-entrega" className="text-xs">Fecha Entrega</Label>
              <Input
                type="date"
                id="fecha-entrega"
                value={datosGenerales.fechaEntrega}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    fechaEntrega: e.target.value,
                  })
                }
                className="h-8 text-xs w-full"
              />
            </div>
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="purchase-order" className="text-xs">Orden de Compra</Label>
              <Input
                id="purchase-order"
                placeholder="Ingrese el Orden"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.purchaseOrder}
                onChange={(e) =>
                  setDatosGenerales({
                    ...datosGenerales,
                    purchaseOrder: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className="flex flex-col space-y-0.5 mt-3 w-full">
            <Label htmlFor="detalle" className="text-xs">Detalle</Label>
            <Input
              id="detalle"
              placeholder="Importación"
              className="h-10 text-sm md:h-9 md:text-xs w-full"
              value={datosGenerales.detalle}
              onChange={(e) =>
                setDatosGenerales({
                  ...datosGenerales,
                  detalle: e.target.value,
                })
              }
            />
          </div>
          <DataImportacion onChange={(d) => setDataImportacion(d)} />
          <PDFAdjunto onChangeFiles={(fs) => setAdjuntos(fs)} />
          <TableAddImport onChange={(rows) => setProductos(rows)} />
        </div>
      </div>
    </div>
  )
}
