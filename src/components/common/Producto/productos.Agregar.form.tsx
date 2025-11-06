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
  [key: string]: string | number | boolean | undefined;
  isNew?: boolean;
  grade?: string;
}

interface Props {
  navigate: any;
  categoria: string;
  onNext: (productos: ProductoBase[]) => void;
}

export default function ProductosAgregarForm({
  navigate,
  categoria,
  onNext,
}: Props) {
  const { products } = useProducts();
  const [productos, setProductos] = useState<ProductoBase[]>([]);

  const columnasPorCategoria: Record<string, { key: string; label: string }[]> =
  {
    BobinasCarton: [
      { key: "grade", label: "Descripción" },
      { key: "tipo", label: "Tipo" },
      { key: "ancho", label: "Ancho (mm)" },
      { key: "gramaje", label: "Gramaje (g)" },
      { key: "unidad", label: "Unidad medida" },
    ],
    default: [
      { key: "tipo", label: "Tipo" },
      { key: "ancho", label: "Ancho (cm)" },
      { key: "largo", label: "Largo (cm)" },
      { key: "gramaje", label: "Gramaje (g)" },
      { key: "calibre", label: "Calibre" },
      { key: "pliegos", label: "Pliegos x Paquete" },
      { key: "unidad", label: "Unidad medida" },
    ],
  };

  const columnas =
    columnasPorCategoria[categoria] || columnasPorCategoria.default;

  useEffect(() => {
    if (!categoria) return;

    const existentes = products
      .filter((p) => p.categoria === categoria)
      .map((p, i) => ({
        tempId: i + 1,
        tipo: p.material.tipo ?? "",
        ancho: String(p.material.dimensiones?.ancho_cm ?? ""),
        largo: String(p.material.dimensiones?.largo_cm ?? ""),
        gramaje: String(p.material.gramaje_g ?? ""),
        calibre: String(p.material.calibre ?? ""),
        pliegos: String(p.material.pliegos_por_paquete ?? ""),
        unidad: p.material.unidad_medida ?? "",
        productName: p.nombre_producto ?? "",
        grade: p.grade ?? "",
        isNew: false,
      }));

    setProductos(
      existentes.length
        ? existentes
        : [
          {
            tempId: 1,
            tipo: "",
            ancho: "",
            largo: "",
            gramaje: "",
            calibre: "",
            pliegos: "",
            unidad: "",
            grade: "",
            isNew: true,
          },
        ]
    );
  }, [categoria, products]);

  const handleChange = (id: number, campo: string, valor: string) => {
    setProductos((prev) =>
      prev.map((p) => (p.tempId === id ? { ...p, [campo]: valor } : p))
    );
  };

  const agregarFila = () => {
    const last = productos[productos.length - 1];
    const nextId = ((last?.tempId as number) ?? 0) + 1;
    const nuevo: ProductoBase = { tempId: nextId, isNew: true };
    columnas.forEach((c) => (nuevo[c.key] = ""));
    setProductos((prev) => [...prev, nuevo]);
  };

  const validar = (): boolean => {
    return productos.some(
      (p) =>
        p.isNew &&
        columnas.every((col) => String(p[col.key] ?? "").trim() !== "")
    );
  };

  const continuar = () => {
    if (!categoria) return toast.error("Selecciona una categoría.");
    if (!validar())
      return toast.error("Completa todos los campos antes de continuar.");

    const nuevos = productos.filter((p) => p.isNew);
    onNext(nuevos); // Pasamos los productos con el `grade` incluido
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            {columnas.map((c) => (
              <TableHead key={c.key}>{c.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p) => (
            <TableRow key={p.tempId}>
              {columnas.map((c) => (
                <TableCell key={c.key}>
                  {c.key === "unidad" ? (
                    <Select
                      value={p.unidad as string}
                      onValueChange={(v) => handleChange(p.tempId, c.key, v)}
                      disabled={!p.isNew}
                    >
                      <SelectTrigger className="h-7 text-sm">
                        <SelectValue placeholder="Unidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unidad">Unidad</SelectItem>
                        <SelectItem value="Paquete">Paquete</SelectItem>
                        <SelectItem value="Docena">Docena</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      value={String(p[c.key] ?? "")}
                      onChange={(e) => handleChange(p.tempId, c.key, e.target.value)}
                      disabled={!p.isNew}
                      className="h-7 text-sm"
                    />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={columnas.length}>
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
          className="cursor-pointer"
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
        >
          Cancelar
        </Button>
        <Button
          className="cursor-pointer"
          size="sm"
          onClick={continuar}
          disabled={!categoria}
        >
          Continuar
        </Button>
      </div>
    </>
  );
}
