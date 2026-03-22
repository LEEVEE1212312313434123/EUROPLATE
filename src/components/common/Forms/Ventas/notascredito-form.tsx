
"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { FileText, PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Importación de tu tabla
import TablaNotasCredito from "@/pages/general/share/tablas/TablaNotasCredito"

export function NotasCreditoForm() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <FileText className="h-6 w-6 text-orange-600" />
            Notas de Crédito
          </h1>
          <p className="text-muted-foreground text-sm">
            Gestiona las devoluciones y ajustes de comprobantes emitidos.
          </p>
        </div>

        {/* BOTÓN A LA DERECHA */}
        <Button
          onClick={() => navigate("/ventas/crear-notaventa")}
          variant="outline"
          className="border-orange-200 hover:bg-orange-50 text-orange-700 shadow-sm gap-2 w-full md:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva Nota de Venta Crédito
        </Button>
      </div>

      <Separator />

      {/* CONTENEDOR DE LA TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <TablaNotasCredito />
      </div>
    </div>
  );
}