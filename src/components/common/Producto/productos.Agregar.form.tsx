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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  isNew?: boolean;
}

interface Props {
  navigate: any;
  categoria: string;
  onNext?: (productos: any[], categoria: string) => void;
}

export default function ProductosAgregarForm({
  navigate,
  categoria,
  onNext,
}: Props) {
  const { products } = useProducts();
  const [productos, setProductos] = useState<ProductoBase[]>([]);

  const columnConfig: Record<string, { key: keyof ProductoBase; label: string }[]> = {
    default: [
      { key: "tipo", label: "Tipo" },
      { key: "dimensiones", label: "Dimensiones" },
      { key: "ancho", label: "Ancho (cm)" },
      { key: "largo", label: "Largo (cm)" },
      { key: "gramaje", label: "Gramaje (g)" },
      { key: "calibre", label: "Calibre" },
      { key: "pliegos", label: "Pliegos x Paquete" },
      { key: "unidad", label: "Unidad medida" },
    ],
    BobinasCarton: [
      { key: "tipo", label: "Grade" },
      { key: "dimensiones", label: "Type" },
      { key: "ancho", label: "Width" },
      { key: "gramaje", label: "Gsm" },
      { key: "unidad", label: "Unidad medida" },
    ],
  };

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
    const config = columnConfig[categoria] || columnConfig.default;
    const nuevos = productos.filter((p) => p.isNew);

    for (const prod of nuevos) {
      const todosLlenos = config.every(
        (col) => String(prod[col.key] ?? "").trim() !== ""
      );
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

    const config = columnConfig[categoria] || columnConfig.default;

    const productosNuevos = productos.filter((p) => {
      if (!p.isNew) return false;
      return config.every((col) => String(p[col.key] ?? "").trim() !== "");
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
            {(columnConfig[categoria] || columnConfig.default).map((col) => (
              <TableHead key={col.key} className="px-2 text-center">
                {col.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.tempId} className="h-8">
              {(columnConfig[categoria] || columnConfig.default).map((col) => {
                let extraClass = "";
                if (categoria === "BobinasCarton") {
                  if (col.key === "tipo") extraClass = "w-40";
                  else if (["dimensiones", "ancho", "gramaje"].includes(col.key))
                    extraClass = "w-24";
                  else extraClass = "w-28";
                } else {
                  extraClass = "w-32";
                }

                return (
                  <TableCell key={col.key} className={`px-1 py-1 ${extraClass}`}>
                    {col.key === "unidad" ? (
                      <Select
                        value={producto.unidad}
                        onValueChange={(value) =>
                          handleProductoChange(producto.tempId, "unidad", value)
                        }
                      >
                        <SelectTrigger className="h-7 text-sm w-full">
                          <SelectValue placeholder="Selecciona" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Unidad">Unidad</SelectItem>
                          <SelectItem value="Docena">Docena</SelectItem>
                          <SelectItem value="Paquete">Paquete</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        value={String(producto[col.key] ?? "")}
                        onChange={(e) =>
                          handleProductoChange(
                            producto.tempId,
                            col.key,
                            e.target.value
                          )
                        }
                        className="h-7 text-sm w-full"
                      />
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
          <TableRow>
            <TableCell
              colSpan={(columnConfig[categoria] || columnConfig.default).length}
              className="text-start py-1"
            >
              <Button
                variant="ghost"
                onClick={agregarFila}
                disabled={!categoria || categoria.trim() === ""}
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
