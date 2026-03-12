"use client"

import { useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe,
  Package2,
  PlusCircle,
  ArrowLeft
} from "lucide-react"

// Importación de tus tablas
import TablaComprasImportacion from "@/pages/general/share/tablas/TablaComprasImportacion"
import TablaComprasNacionales from "@/pages/general/share/tablas/TablaComprasNacionales"

export default function ComprasLogistica() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">

      {/* CABECERA CON BOTÓN A LA DERECHA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Gestión de Logística
          </h1>
          <p className="text-muted-foreground text-sm">
            Administra el ingreso de mercancía nacional e internacional.
          </p>
        </div>

        {/* BOTÓN DE ACCIÓN SUPERIOR DERECHA */}
        <div className="flex items-center gap-3">
          <Button
            variant="default"
            onClick={() => navigate("/logistica/addbuy")}
            className="gap-2 shadow-sm bg-blue-600 hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" />
            Nueva Compra
          </Button>
        </div>
      </div>

      <Tabs defaultValue="importacion" className="w-full">
        {/* BOTONES DE INTERCAMBIO DE VISTA */}
        <div className="flex items-center justify-between mb-6">
          <TabsList className="grid w-full max-w-[400px] grid-cols-2">
            <TabsTrigger value="importacion" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Importación
            </TabsTrigger>
            <TabsTrigger value="nacional" className="flex items-center gap-2">
              <Package2 className="h-4 w-4" />
              Nacional
            </TabsTrigger>
          </TabsList>

          {/* Opcional: Podrías poner contadores o filtros rápidos aquí */}
        </div>

        {/* CONTENIDO DE TABLA IMPORTACIÓN */}
        <TabsContent value="importacion" className="mt-0 outline-none">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <TablaComprasImportacion />
            </CardContent>
          </Card>
        </TabsContent>

        {/* CONTENIDO DE TABLA NACIONAL */}
        <TabsContent value="nacional" className="mt-0 outline-none">
          <Card className="border-none shadow-none bg-transparent">
            <CardContent className="p-0">
              <TablaComprasNacionales />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* FOOTER DE RETORNO (Opcional) */}
      <div className="pt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver atrás
        </Button>
      </div>
    </div>
  )
}