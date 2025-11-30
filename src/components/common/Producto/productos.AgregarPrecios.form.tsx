import { useState, useEffect } from "react";
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
import { ProductService } from "@/services/products.service";
import type { Product } from "@/types/product.types";

interface Props {
  navigate: any;
  productosPrevios: any[];
  categoria: string;
}

export default function ProductosAgregarPreciosForm({
  navigate,
  productosPrevios,
  categoria,
}: Props) {
  const [productos, setProductos] = useState<any[]>(productosPrevios);
  const [maxId, setMaxId] = useState(0);

  useEffect(() => {
    ProductService.getMaxId()
      .then(setMaxId)
      .catch(() => toast.error("Error al obtener el ID máximo"));
  }, []);

  const handleChange = (id: number, field: string, value: string) => {
    setProductos((prev) =>
      prev.map((p) => (p.tempId === id ? { ...p, [field]: value } : p))
    );
  };

  const [isSaving, setIsSaving] = useState(false);
  const guardar = async () => {
  if (isSaving) return; // evita doble clic
  setIsSaving(true);

  const invalidos = productos.some(
    (p) => !p.precioMin || !p.precioMax || isNaN(p.precioMin) || isNaN(p.precioMax)
  );
  if (invalidos) {
    toast.error("Completa todos los precios válidamente.");
    setIsSaving(false);
    return;
  }

  const nuevos: Product[] = productos.map((p, i) => {
    // 🔹 Lógica para stock según unidad
    let stockActual = 10; // valor por defecto
    const unidad = (p.unidad ?? "").toLowerCase();

    if (unidad === "unidad") stockActual = 1;
    else if (unidad === "docena") stockActual = 12;

    return {
      id: maxId + i + 1,
      nombre_producto: p.productName ?? `${categoria} ${p.tipo ?? ""}`,
      categoria,
      material: {
        tipo: p.tipo ?? "",
        dimensiones: {
          ancho_cm: Number(p.ancho || 0),
          largo_cm: Number(p.largo || 0),
        },
        gramaje_g: Number(p.gramaje || 0),
        calibre: Number(p.calibre || 0),
        pliegos_por_paquete: Number(p.pliegos || 0),
        unidad_medida: p.unidad ?? "",
        peso_kg: Number(p.peso || 0),
      },
      precio: {
        precio_min: Number(p.precioMin),
        precio_max: Number(p.precioMax),
        moneda: "USD",
      },
      almacen: {
        stock_actual: stockActual,
        stock_minimo: 3,
        ubicacion: "A1",
      },
      estado: "Disponible",
      accion: "Ver",
      tipo: "producto",
      fecha_registro: new Date().toISOString(),
      imagen: p.imagen || "https://dummyimage.com/400x400/4c65bf/db398a",
      grade: p.grade ?? "",
      activo: true,
    };
  });

  try {
    await ProductService.addMany(nuevos);
    toast.success("Productos guardados correctamente.");
    navigate("/products?tab=lista");
  } catch (err) {
    console.error(err);
    toast.error("Error al guardar los productos.");
  } finally {
    setIsSaving(false);
  }
};
  const renderDescripcion = (p: any) => {
  const tipoVisual =
    categoria === "BobinasCarton"
      ? "Bobinas de Carton"
      : categoria ?? "";

  return `${tipoVisual} ${p.tipo ?? ""} ${p.ancho ?? ""}x${p.largo ?? ""} ${
    p.gramaje ?? ""
  }g calibre ${p.calibre ?? ""} ${p.unidad?.toLowerCase() ?? ""} ${
    p.pliegos ?? ""
  } pliegos`;
};

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            {["Producto", "Peso (kg)", "Precio Min", "Precio Max"].map((t) => (
              <TableHead key={t}>{t}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p) => (
            <TableRow key={p.tempId}>
              <TableCell className="font-medium">
                {renderDescripcion(p)}
              </TableCell>
              {["peso", "precioMin", "precioMax"].map((f) => (
                <TableCell key={f}>
                  <Input
                    type="number"
                    value={p[f] ?? ""}
                    onChange={(e) => handleChange(p.tempId, f, e.target.value)}
                    className="h-7 text-sm"
                    min="0"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button className="cursor-pointer" variant="outline" onClick={() => navigate(-1)}>
          Atrás
        </Button>
        <Button className="cursor-pointer" onClick={guardar} disabled={isSaving}>
          {isSaving ? "Guardando..." : "Finalizar"}
        </Button>
      </div>
    </>
  );
}
