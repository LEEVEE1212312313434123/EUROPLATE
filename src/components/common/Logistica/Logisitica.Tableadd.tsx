import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";

interface ProductoBase {
  tempId: number;
  tipo: string;
  dimensiones: string;
  ancho: string;
  largo: string;
  gramaje: string;
  calibre: string;
  pliegos: string;
  unidad: string;
  productName?: string;
  isNew?: boolean; // Nuevo campo
}

interface Props {
  navigate: any;
  categoria: string; // Recibe la categoría seleccionada del FormPadre
  onNext?: (productos: any[], categoria: string) => void;
}

export default function ProductosAgregarForm({
  navigate,
  categoria,
  onNext,
}: Props) {
  const { products } = useProducts();
  const [productos, setProductos] = useState<ProductoBase[]>([]);

  useEffect(() => {
    if (categoria) {
      const filtrados = products
        .filter((p) => p.categoria === categoria)
        .map((p, idx) => ({
          tempId: idx + 1,
          tipo: p.material.tipo,
          dimensiones: `${p.material.dimensiones.ancho_cm}x${p.material.dimensiones.largo_cm}`,
          ancho: String(p.material.dimensiones.ancho_cm),
          largo: String(p.material.dimensiones.largo_cm),
          gramaje: String(p.material.gramaje_g),
          calibre: String(p.material.calibre),
          pliegos: String(p.material.pliegos_por_paquete),
          unidad: p.material.unidad_medida,
          productName: `${p.material.tipo} ${p.material.dimensiones.ancho_cm}x${p.material.dimensiones.largo_cm}cm ${p.material.gramaje_g}g calibre ${p.material.calibre} pliegos ${p.material.pliegos_por_paquete} unidad ${p.material.unidad_medida}`,
          isNew: false,
        }));

      setProductos(
        filtrados.length > 0
          ? filtrados
          : [
              {
                tempId: 1,
                tipo: "",
                dimensiones: "",
                ancho: "",
                largo: "",
                gramaje: "",
                calibre: "",
                pliegos: "",
                unidad: "",
                isNew: true,
              },
            ]
      );
    }
  }, [categoria, products]);

  const handleProductoChange = (
    tempId: number,
    field: keyof ProductoBase,
    value: string
  ) => {
    setProductos((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    );
  };

  const agregarFila = () => {
    const newTempId =
      productos.length > 0 ? productos[productos.length - 1].tempId + 1 : 1;
    setProductos((prev) => [
      ...prev,
      {
        tempId: newTempId,
        tipo: "",
        dimensiones: "",
        ancho: "",
        largo: "",
        gramaje: "",
        calibre: "",
        pliegos: "",
        unidad: "",
        isNew: true,
      },
    ]);
  };

  const validarProductos = () => {
    const nuevos = productos.filter((p) => p.isNew);
    for (const prod of nuevos) {
      const campos = [
        prod.tipo,
        prod.dimensiones,
        prod.ancho,
        prod.largo,
        prod.gramaje,
        prod.calibre,
        prod.pliegos,
        prod.unidad,
      ];
      const todosLlenos = campos.every((v) => v.trim() !== "");
      if (todosLlenos) return true;
    }
    return false;
  };

  const handleSiguiente = () => {
    if (!categoria || categoria.trim() === "") {
      toast.error("Debes seleccionar una categoría antes de continuar.");
      return;
    }

    if (!validarProductos()) {
      toast.error(
        "Completa todos los campos de los productos nuevos antes de continuar."
      );
      return;
    }

    const productosNuevos = productos.filter((p) => {
      if (!p.isNew) return false;
      return (
        p.tipo.trim() !== "" &&
        p.dimensiones.trim() !== "" &&
        p.ancho.trim() !== "" &&
        p.largo.trim() !== "" &&
        p.gramaje.trim() !== "" &&
        p.calibre.trim() !== "" &&
        p.pliegos.trim() !== "" &&
        p.unidad.trim() !== ""
      );
    });

    const productosConNombre = productosNuevos.map((p) => ({
      ...p,
      productName: `${categoria} ${p.tipo}`, 
    }));

    if (onNext) {
      onNext(productosConNombre, categoria);
    }
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            {[
              "Importacion",
              "Descripción",
              "Proveedor",
              "Origen",
              "Destino",
              "Estado",
              "Fecha Entrega",
            ].map((title) => (
              <TableHead key={title} className="px-2 text-center">
                {title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.tempId} className="h-8">
              {(
                [
                  "tipo",
                  "dimensiones",
                  "ancho",
                  "largo",
                  "gramaje",
                  "calibre",
                  "pliegos",
                ] as (keyof ProductoBase)[]
              ).map((field) => (
                <TableCell key={field} className="px-2 py-1">
                  <Input
                    value={String(producto[field] ?? "")}
                    onChange={(e) =>
                      handleProductoChange(
                        producto.tempId,
                        field,
                        e.target.value
                      )
                    }
                    className="h-7 text-sm"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={8} className="text-start py-1">
              <Button
                variant="ghost"
                onClick={agregarFila}
                className="inline-flex items-center gap-1 rounded-full p-1 text-primary hover:bg-primary/20 cursor-pointer"
              >
                <PlusCircle size={24} />
                <span>Agregar Tipo</span>
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          className="cursor-pointer"
          onClick={handleSiguiente}
          disabled={!categoria || categoria.trim() === ""}
        >
          Continuar
        </Button>
      </div>
    </>
  );
}
