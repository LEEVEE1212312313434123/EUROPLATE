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
  categoria: string;       // 👈 producto real (Bobinas, Tintas, etc.)
  tipo_producto: Product["tipo_producto"]; // 👈 macro tipo
}

export default function ProductosAgregarPreciosForm({
  navigate,
  productosPrevios,
  categoria,
  tipo_producto,
}: Props) {
  const [productos, setProductos] = useState<any[]>(productosPrevios);
  const [maxId, setMaxId] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

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

  const guardar = async () => {
    if (isSaving) return;
    setIsSaving(true);

    const invalidos = productos.some(
      (p) =>
        !p.precioMin ||
        !p.precioMax ||
        isNaN(p.precioMin) ||
        isNaN(p.precioMax)
    );

    if (invalidos) {
      toast.error("Completa todos los precios válidamente.");
      setIsSaving(false);
      return;
    }

    const nuevos: Product[] = productos.map((p, i) => ({
      id: maxId + i + 1,
      nombre_producto: `${categoria} ${p.tipo ?? ""}`,
      categoria,              // ✅ producto real
      tipo_producto,           // ✅ macro tipo
      material: {
        tipo: categoria,
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
        stock_actual: 10,
        stock_minimo: 3,
        ubicacion: "A1",
      },
      estado: "Disponible",
      accion: "Ver",
      tipo: "producto",
      fecha_registro: new Date().toISOString(),
      imagen: "https://dummyimage.com/400x400/4c65bf/db398a",
      grade: p.grade ?? "",
      activo: true,
    }));

    try {
      await ProductService.addMany(nuevos);
      toast.success("Productos guardados correctamente.");
      navigate("/products?tab=lista");
    } catch {
      toast.error("Error al guardar los productos.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Peso (kg)</TableHead>
            <TableHead>Precio Min</TableHead>
            <TableHead>Precio Max</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((p) => (
            <TableRow key={p.tempId}>
              <TableCell>{categoria}</TableCell>
              {["peso", "precioMin", "precioMax"].map((f) => (
                <TableCell key={f}>
                  <Input
                    type="number"
                    value={p[f] ?? ""}
                    onChange={(e) =>
                      handleChange(p.tempId, f, e.target.value)
                    }
                    className="h-7 text-sm"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Atrás
        </Button>
        <Button onClick={guardar} disabled={isSaving}>
          Finalizar
        </Button>
      </div>
    </>
  );
}
