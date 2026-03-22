import { Package } from "lucide-react";
import CrearVarianteProducto from "@/pages/general/CrearVarianteProducto";

export default function AgregarProductosPage() {

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-start gap-4">
        <Package className="h-12 w-12 text-primary mt-1" />

        <div>
          <h1 className="text-xl font-semibold">Nuevo Producto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completa los datos base para cada producto
          </p>


        </div>

      </div>
      <div className="flex justify-center min-h-screen"> <CrearVarianteProducto /></div>

    </div>
  );
}
