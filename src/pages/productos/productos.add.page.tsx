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

import { TipoProductoEnum } from "@/types/products/product-type.enum";
import { PRODUCT_CATEGORIES } from "@/hooks/products/constants/product-categories";

/* =========================
   ADAPTADOR LEGACY
========================= */

const mapTipoProductoToLegacy = (
  tipo: TipoProductoEnum
):
  | "Materia Prima"
  | "Producto Terminado"
  | "Insumo de Producción"
  | "Suministro Técnico" => {
  switch (tipo) {
    case TipoProductoEnum.MERCADERIA:
      return "Materia Prima";
    case TipoProductoEnum.PRODUCTO_TERMINADO:
      return "Producto Terminado";
    case TipoProductoEnum.INSUMO:
      return "Insumo de Producción";
    default:
      return "Materia Prima";
  }
};

/* =========================
   COMPONENTE
========================= */

export default function AgregarProductosPage() {
  const navigate = useNavigate();

  // Enum moderno
  const [tipoProducto, setTipoProducto] =
    useState<TipoProductoEnum | null>(null);

  // Subcategoría real
  const [categoria, setCategoria] = useState<string>("");

  const [step, setStep] = useState(1);
  const [productos, setProductos] = useState<any[]>([]);

  const habilitado = Boolean(tipoProducto && categoria);

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
            <div className="mt-6 ml-[36px] flex gap-6">
              {/* TIPO DE PRODUCTO */}
              <div>
                <label className="block text-base font-semibold mb-1">
                  Tipo de producto
                </label>

                <Select
                  value={tipoProducto ?? ""}
                  onValueChange={(v) => {
                    setTipoProducto(v as TipoProductoEnum);
                    setCategoria("");
                  }}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona tipo" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value={TipoProductoEnum.MERCADERIA}>
                      Mercadería
                    </SelectItem>
                    <SelectItem value={TipoProductoEnum.PRODUCTO_TERMINADO}>
                      Producto terminado
                    </SelectItem>
                    <SelectItem value={TipoProductoEnum.INSUMO}>
                      Insumo
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CATEGORÍA */}
              <div>
                <label className="block text-base font-semibold mb-1">
                  Categoría
                </label>

                <Select
                  value={categoria}
                  onValueChange={setCategoria}
                  disabled={!tipoProducto}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>

                  <SelectContent>
                    {tipoProducto &&
                      PRODUCT_CATEGORIES[tipoProducto].map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 ml-[100px] max-w-6xl">
        {step === 1 && tipoProducto && (
          <ProductosAgregarForm
            categoria={categoria}
            tipo_producto={mapTipoProductoToLegacy(tipoProducto)}
            navigate={navigate}
            onNext={avanzarPaso}
            disabled={!habilitado}
          />
        )}

        {step === 2 && tipoProducto && (
          <ProductosAgregarPreciosForm
            categoria={categoria}
            tipo_producto={mapTipoProductoToLegacy(tipoProducto)}
            productosPrevios={productos}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}
