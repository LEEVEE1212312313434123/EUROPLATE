"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Package, PlusCircle } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Importación de tu tabla
import TablaVariantesProductos from "@/pages/general/share/tablas/TablaVariantesProductos"

export function ProductsForm() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ENCABEZADO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Package className="h-6 w-6 text-emerald-600" />
            Catálogo de Productos
          </h1>
          <p className="text-muted-foreground text-sm">
            Gestiona el inventario, variantes y control de stock de tus artículos.
          </p>
        </div>

        {/* BOTÓN A LA DERECHA */}
        <Button
          onClick={() => navigate("/products/addProducts")}
          className="bg-emerald-600 hover:bg-emerald-700 shadow-sm gap-2 w-full md:w-auto text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      <Separator />

      {/* CONTENEDOR DE LA TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <TablaVariantesProductos />
      </div>
    </div>
  );
}