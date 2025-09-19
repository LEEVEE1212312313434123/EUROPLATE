"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DataImportacion from "@/components/common/Logistica/Data.Importacion"
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt"
import TableAddImport from "@/components/common/Logistica/Table.add"
import { guardarImportacion } from "@/services/LogisticaImportacion.service"
import type { OrdenImportacion } from "@/types/ImportacionLogistica.types"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

export default function AgregarLogistica() {
  const [datosGenerales, setDatosGenerales] = useState({
    numImportacion: "",
    fechaPedido: "",
    fechaEntrega: "",
    purchaseOrder: "",
    detalle: "",
  })

  const navigate = useNavigate()

  const [datosImportacion, setDatosImportacion] = useState<any>({})
  const [datosEconomicos, setDatosEconomicos] = useState<any>({})
  const [adjuntos, setAdjuntos] = useState<string[]>([])
  const [productos, setProductos] = useState<any[]>([])

  // 🔹 Generar N° de importación automático al montar el componente
  useEffect(() => {
    const generarNumeroImportacion = () => {
      // Obtener contador del localStorage
      let contador = parseInt(localStorage.getItem("contadorImportacion") || "0", 10)

      // Generar un número aleatorio de 8 dígitos
      const aleatorio = Math.floor(Math.random() * 1_0000_0000) // 0 a 99999999

      // Incrementar contador
      contador += 1
      localStorage.setItem("contadorImportacion", contador.toString())

      // Combinar para formar 10 dígitos: 2 fijos + aleatorio + contador modificado
      // Ej: 10 + aleatorio de 8 dígitos
      const numImportacion = (10_0000_0000 + aleatorio + contador).toString().slice(0, 10)

      return numImportacion
    }

    setDatosGenerales((prev) => ({
      ...prev,
      numImportacion: generarNumeroImportacion(),
    }))
  }, [])

  const labels: Record<string, string> = {
    numImportacion: "N° Importación",
    fechaPedido: "Fecha Pedido",
    fechaEntrega: "Fecha Entrega",
    purchaseOrder: "Purchase Order",
    detalle: "Detalle",
  }

  const validarCampos = () => {
    const errs: string[] = []

    // Generales
    Object.entries(datosGenerales).forEach(([k, v]) => {
      if (typeof v !== "string" || v.trim() === "") {
        errs.push(labels[k] || k)
      }
    })

    // Importación
    Object.entries(datosImportacion).forEach(([k, v]) => {
      if (typeof v !== "string" || v.trim() === "") {
        errs.push(`Importación: ${k}`)
      }
    })

    // Económicos
    Object.entries(datosEconomicos).forEach(([k, v]) => {
      if (typeof v === "object" && v !== null) {
        Object.entries(v).forEach(([subk, subv]) => {
          if (typeof subv !== "string" || subv.trim() === "") {
            errs.push(`Económico: ${k}.${subk}`)
          }
        })
      } else if (typeof v !== "string" || v.trim() === "") {
        errs.push(`Económico: ${k}`)
      }
    })

    // Productos
    if (productos.length === 0) {
      errs.push("Debe registrar al menos un producto")
    } else {
      productos.forEach((p, i) => {
        Object.entries(p).forEach(([k, v]) => {
          if (k !== "tempId" && (typeof v !== "string" || v.trim() === "")) {
            errs.push(`Producto ${i + 1}: falta ${k}`)
          }
        })
      })
    }

    // Adjuntos
    if (adjuntos.length === 0) {
      errs.push("Debe adjuntar al menos un archivo")
    }

    return errs
  }

  const handleGuardar = () => {
    const errores = validarCampos()

    if (errores.length > 0) {
      errores.forEach((e) => toast.error(`Falta llenar: ${e}`))
      return
    }

    const orden: OrdenImportacion = {
      datosGenerales,
      datosImportacion,
      datosEconomicos,
      adjuntos: adjuntos.map((f) => f.split("/").pop() || f),
      productos,
    }

    guardarImportacion(orden)
    toast.success("✅ Importación guardada correctamente")
    navigate("/logistica?tab=compras")
  }

  return (
    <div className="w-full">
      {/* botones */}
      <div className="flex justify-end gap-2 p-3 -mt-2">
        <Button className="cursor-pointer h-8 px-3 text-sm" variant="outline">
          Cancelar
        </Button>
        <Button
          className="cursor-pointer h-8 px-3 text-sm"
          onClick={handleGuardar}
        >
          Guardar
        </Button>
      </div>

      <hr className="border-gray-200" />
      <div className="p-4">
        <h2 className="text-lg font-semibold">Registrar Importación</h2>
        <div className="mt-4">
          <h3 className="text-base font-medium mb-3">Datos Generales</h3>
          <div className="flex flex-col md:flex-row gap-3">
            {/* numImportacion */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="num-importacion" className="text-xs">
                N° Importación
              </Label>
              <Input
                id="num-importacion"
                placeholder="N°"
                className="h-10 text-sm md:h-9 md:text-xs w-full"
                value={datosGenerales.numImportacion}
                readOnly
              />
            </div>

            {/* fechaPedido */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-pedido" className="text-xs">
                Fecha Pedido
              </Label>
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

            {/* fechaEntrega */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="fecha-entrega" className="text-xs">
                Fecha Entrega
              </Label>
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

            {/* purchaseOrder */}
            <div className="flex flex-col space-y-0.5 md:w-1/4 w-full">
              <Label htmlFor="purchase-order" className="text-xs">
                Purchase Order
              </Label>
              <Input
                id="purchase-order"
                placeholder="Orden"
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

          {/* detalle */}
          <div className="flex flex-col space-y-0.5 mt-3 w-full">
            <Label htmlFor="detalle" className="text-xs">
              Detalle
            </Label>
            <Input
              id="detalle"
              placeholder="Importación"
              className="h-10 text-sm md:h-9 md:text-xs w-full"
              value={datosGenerales.detalle}
              onChange={(e) =>
                setDatosGenerales({ ...datosGenerales, detalle: e.target.value })
              }
            />
          </div>

          {/* hijos con callbacks */}
          <DataImportacion
            onChangeImport={(d) => setDatosImportacion(d)}
            onChangeEconomico={(d) => setDatosEconomicos(d)}
          />
          <PDFAdjunto onChangeFiles={(fs) => setAdjuntos(fs)} />
          <TableAddImport
            onChange={(rows) => setProductos(rows)}
          />
        </div>
      </div>
    </div>
  )
}
