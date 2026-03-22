// @/components/common/Forms/Ventas/ventas-form.tsx
// import CrearProducto from "@/pages/general/CreateProducto"
// import CrearVarianteProducto from "@/pages/general/CrearVarianteProducto"
// import AtributosManager from "@/pages/general/AtributosManager"
// import AsignarAtributosProducto from "@/pages/general/AsignarAtributosProducto"
// import CrearCompra from "@/pages/general/CrearCompra"
// import VentaPOS from "@/pages/general/VentaPOS"
// import CrearNotaVenta from "@/pages/general/crearNotaVenta"
"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { PlusCircle, ReceiptText } from "lucide-react"
import { Separator } from "@/components/ui/separator"

// Importación de tu tabla
import TablaVentas from "@/pages/general/share/tablas/TablaVentas"

export function VentasForm() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* ENCABEZADO DE VENTAS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <ReceiptText className="h-6 w-6 text-blue-600" />
            Registro de Ventas
          </h1>
          <p className="text-muted-foreground text-sm">
            Visualiza el historial de transacciones y gestiona nuevas ventas.
          </p>
        </div>

        {/* BOTÓN A LA DERECHA */}
        <Button
          onClick={() => navigate("/ventas/crear-venta")}
          className="bg-blue-600 hover:bg-blue-700 shadow-sm gap-2 w-full md:w-auto"
        >
          <PlusCircle className="h-4 w-4" />
          Nueva Venta (POS)
        </Button>
      </div>

      <Separator />

      {/* CONTENEDOR DE LA TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <TablaVentas />
      </div>

      {/* COMPONENTES COMENTADOS (Para referencia futura)
        <CrearProducto />
        <CrearVarianteProducto />
        <AtributosManager />
        <AsignarAtributosProducto />
        <CrearCompra />
        <CrearNotaVenta /> 
      */}
    </div>
  );
}