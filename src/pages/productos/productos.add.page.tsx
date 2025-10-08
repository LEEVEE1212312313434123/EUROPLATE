import { useState } from "react";
import { Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductosAgregarForm from "@/components/common/Producto/productos.Agregar.form";
import ProductosAgregarPreciosForm from "@/components/common/Producto/productos.AgregarPrecios.form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AgregarProductosPage() {
  const navigate = useNavigate();
  const [categoria, setCategoria] = useState("");
  const [step, setStep] = useState(1);
  const [productos, setProductos] = useState<any[]>([]);

  const avanzarPaso = (productos: any[]) => {
    setProductos(productos);
    setStep(2);
  };

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-start gap-4">
        <Package className="h-12 w-12 text-primary mt-1" />
        <div>
          <h1 className="text-xl font-semibold">Nuevo Producto</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completa los datos base para cada producto
          </p>

          {step === 1 && (
            <div className="mt-6 ml-[36px]">
              <label className="block text-base font-semibold mb-1">
                Categoría
              </label>
              <Select
                value={categoria}
                onValueChange={setCategoria}
                disabled={step > 1}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Papel">Papel</SelectItem>
                  <SelectItem value="Cartón">Cartón</SelectItem>
                  <SelectItem value="Hoja">Hoja</SelectItem>
                  <SelectItem value="BobinasCarton">
                    Bobinas de cartón
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 ml-[100px] max-w-6xl">
        {step === 1 && (
          <ProductosAgregarForm
            categoria={categoria}
            navigate={navigate}
            onNext={avanzarPaso}
          />
        )}
        {step === 2 && (
          <ProductosAgregarPreciosForm
            categoria={categoria}
            productosPrevios={productos}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}
