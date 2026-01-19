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

/* =========================
   TIPOS (se mantiene nombre)
========================= */

const mapCategoriaToTipoProducto = (categoria: string) => {
  if (
    ["Bobinas de cartón", "Bobinas de papel", "Papel en hojas", "Cartón kraft"].includes(categoria)
  )
    return "Materia Prima";

  if (
    ["Cajas para paquetes", "Empaques personalizados", "Cajas corrugadas"].includes(categoria)
  )
    return "Producto Terminado";

  if (["Placas de impresión", "Tintas", "Barnices"].includes(categoria))
    return "Insumo de Producción";

  return "Suministro Técnico";
};

type TipoProducto =
  | "Bobinas de cartón"
  | "Bobinas de papel"
  | "Papel en hojas"
  | "Cartón kraft"
  | "Cajas para paquetes"
  | "Empaques personalizados"
  | "Cajas corrugadas"
  | "Placas de impresión"
  | "Tintas"
  | "Barnices"
  | "Repuestos de máquina"
  | "Rodillos"
  | "Lubricantes";

/* =========================
   PRODUCTOS POR CATEGORÍA
========================= */

const TIPOS_PRODUCTO_POR_CATEGORIA: Record<string, TipoProducto[]> = {
  MateriaPrima: [
    "Bobinas de cartón",
    "Bobinas de papel",
    "Papel en hojas",
    "Cartón kraft",
  ],
  ProductosTerminados: [
    "Cajas para paquetes",
    "Empaques personalizados",
    "Cajas corrugadas",
  ],
  InsumosProduccion: [
    "Placas de impresión",
    "Tintas",
    "Barnices",
  ],
  SuministrosTecnicos: [
    "Repuestos de máquina",
    "Rodillos",
    "Lubricantes",
  ],
};

/* =========================
   COMPONENTE
========================= */

export default function AgregarProductosPage() {
  const navigate = useNavigate();

  const [categoria, setCategoria] = useState("");
  const [tipoProducto, setTipoProducto] = useState<TipoProducto | "">("");
  const [step, setStep] = useState(1);
  const [productos, setProductos] = useState<any[]>([]);

  const habilitado = Boolean(tipoProducto);

  const handleCategoriaChange = (value: string) => {
    setCategoria(value);
    setTipoProducto("");
  };

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
              {/* CATEGORÍA */}
              <div>
                <label className="block text-base font-semibold mb-1">
                  Categoría
                </label>
                <Select
                  value={categoria}
                  onValueChange={handleCategoriaChange}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MateriaPrima">
                      Materia Prima
                    </SelectItem>
                    <SelectItem value="ProductosTerminados">
                      Productos Terminados
                    </SelectItem>
                    <SelectItem value="InsumosProduccion">
                      Insumos de Producción
                    </SelectItem>
                    <SelectItem value="SuministrosTecnicos">
                      Suministros Técnicos
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* TIPO DE PRODUCTO (producto real) */}
              <div>
                <label className="block text-base font-semibold mb-1">
                  Tipo de Producto
                </label>
                <Select
                  value={tipoProducto}
                  onValueChange={(v) =>
                    setTipoProducto(v as TipoProducto)
                  }
                  disabled={!categoria}
                >
                  <SelectTrigger className="w-64">
                    <SelectValue placeholder="Selecciona producto" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIPOS_PRODUCTO_POR_CATEGORIA[categoria]?.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
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
        {step === 1 && (
          <ProductosAgregarForm
            categoria={tipoProducto} // 👈 producto real
            tipo_producto={mapCategoriaToTipoProducto(tipoProducto)}
            navigate={navigate}
            onNext={avanzarPaso}
            disabled={!habilitado}
          />
        )}

        {step === 2 && tipoProducto && (
          <ProductosAgregarPreciosForm
            categoria={tipoProducto} // 👈 producto real
           tipo_producto={mapCategoriaToTipoProducto(tipoProducto)}
            productosPrevios={productos}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
}
