import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Package, PlusCircle, Trash } from "lucide-react";
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

interface ProductoBase {
  tempId: number;
  nombre: string;
  tamaño: string;
  peso: string;
  calibre: string;
  cantidad: string;
}

export default function AgregarProductosStep1() {
  const [productos, setProductos] = useState<ProductoBase[]>([
    {
      tempId: 1,
      nombre: "",
      tamaño: "",
      peso: "",
      calibre: "",
      cantidad: "",
    },
  ]);

  const navigate = useNavigate();

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
        nombre: "",
        tamaño: "",
        peso: "",
        calibre: "",
        cantidad: "",
      },
    ]);
  };

  const eliminarFila = (tempId: number) => {
    setProductos((prev) => prev.filter((p) => p.tempId !== tempId));
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

    // Generar productName y pasar al siguiente paso
    const productosConNombre = productos.map((p) => ({
      ...p,
      productName: `${p.nombre} ${p.tamaño} ${p.peso}g calibre ${p.calibre} paquete ${p.cantidad} pliegos`,
    }));

    // Aquí puedes guardar en estado global/contexto o pasar por navegación si usas algo como zustand o redux
    // navigate("/productos/agregar/stp2", { state: productosConNombre });

    console.log("Ir al siguiente paso con:", productosConNombre);
    navigate("/productos/agregar2", { state: productosConNombre });
  };

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-center gap-4">
        <Package className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Agregar Productos (Paso 1)</h1>
          <p className="text-muted-foreground">
            Completa los datos base para cada producto
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Tamaño</TableHead>
            <TableHead>Peso (g)</TableHead>
            <TableHead>Calibre</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.tempId}>
              <TableCell>
                <Input
                  value={producto.nombre}
                  onChange={(e) =>
                    handleProductoChange(
                      producto.tempId,
                      "nombre",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={producto.tamaño}
                  onChange={(e) =>
                    handleProductoChange(
                      producto.tempId,
                      "tamaño",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={producto.peso}
                  onChange={(e) =>
                    handleProductoChange(
                      producto.tempId,
                      "peso",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={producto.calibre}
                  onChange={(e) =>
                    handleProductoChange(
                      producto.tempId,
                      "calibre",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell>
                <Input
                  value={producto.cantidad}
                  onChange={(e) =>
                    handleProductoChange(
                      producto.tempId,
                      "cantidad",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => eliminarFila(producto.tempId)}
                  className="text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                  aria-label="Eliminar fila"
                >
                  <Trash size={18} />
                </Button>
              </TableCell>
            </TableRow>
          ))}

          {/* Botón para agregar fila */}
          <TableRow>
            <TableCell colSpan={6} className="text-center">
              <Button
                variant="ghost"
                onClick={agregarFila}
                className="inline-flex items-center justify-center rounded-full p-2 text-primary hover:bg-primary/20"
              >
                <PlusCircle size={32} />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Cancelar
        </Button>
        <Button onClick={handleSiguiente}>Siguiente</Button>
      </div>
    </div>
  );
}
