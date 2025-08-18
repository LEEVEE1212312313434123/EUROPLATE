import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  pliegues: string;
  unidad: string;
  productName?: string;
}

interface Props {
  navigate: any;
  categoria: string;
  onNext?: (productos: any[]) => void; // 👈 nuevo
}

export default function ProductosAgregarForm({ navigate, categoria, onNext }: Props) {
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
          pliegues: String(p.material.pliegos_por_paquete),
          unidad: p.material.unidad_medida,
          productName: p.nombre_producto,
        }));

      setProductos(filtrados.length > 0 ? filtrados : [
        { tempId: 1, tipo: "", dimensiones: "", ancho: "", largo: "", gramaje: "", calibre: "", pliegues: "", unidad: "" },
      ]);
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
      { tempId: newTempId, tipo: "", dimensiones: "", ancho: "", largo: "", gramaje: "", calibre: "", pliegues: "", unidad: "" },
    ]);
  };

  const validarProductos = () => {
    for (const prod of productos) {
      const campos = Object.values(prod).filter((v) => typeof v === "string");
      const todosLlenos = campos.every((v) => String(v).trim() !== "");
      if (!todosLlenos) return false;
    }
    return true;
  };

  const handleSiguiente = () => {
    if (!validarProductos()) {
        toast.error("Completa todos los campos antes de continuar.");
        return;
    }

    const productosConNombre = productos.map((p) => ({
    ...p,
        productName: `${p.tipo} ${p.ancho}x${p.largo}cm ${p.gramaje}g calibre ${p.calibre} pliegues ${p.pliegues} unidad ${p.unidad}`,
    }));
     if (onNext) {
        onNext(productosConNombre); 
    } else {
        navigate("/productos/agregar2", { state: productosConNombre });
    }
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            {["Tipo", "Dimensiones", "Ancho (cm)", "Largo (cm)", "Gramaje (g)", "Calibre", "Pliegues x Paquete", "Unidad medida"].map((title) => (
              <TableHead key={title} className="px-2 text-center">{title}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.tempId} className="h-8">
              {(["tipo", "dimensiones", "ancho", "largo", "gramaje", "calibre", "pliegues", "unidad"] as (keyof ProductoBase)[]).map((field) => (
                <TableCell key={field} className="px-2 py-1">
                  <Input
                    value={producto[field]}
                    onChange={(e) => handleProductoChange(producto.tempId, field, e.target.value)}
                    className="h-7 text-sm"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
          <TableRow>
            <TableCell colSpan={8} className="text-center py-1">
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
        <Button variant="outline" size="sm" className="cursor-pointer" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button size="sm" className="cursor-pointer" onClick={handleSiguiente}>Siguiente</Button>
      </div>
    </>
  );
}
