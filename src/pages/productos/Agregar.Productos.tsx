import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Package, PlusCircle, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Producto {
  id: number;
  nombre: string;
  peso: string;
  minKg: string;
  maxKg: string;
  minPrecio: string;
  maxPrecio: string;
}

export default function AgregarProductos() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [nuevosProductos, setNuevosProductos] = useState<
    (Omit<Producto, "id"> & { tempId: number })[]
  >([]);

  const [selectedProducto, setSelectedProducto] = useState("Papel Folcote");
  const navigate = useNavigate();
  const location = useLocation();

  // Recibir producto(s) enviado(s) desde Paso 1 y crear filas iniciales
  useEffect(() => {
    const productosDesdePaso1 = location.state as
      | { productName: string }[]
      | undefined;

    if (productosDesdePaso1 && productosDesdePaso1.length > 0) {
      const productosIniciales = productosDesdePaso1.map((prod, index) => ({
        id: index + 1,
        nombre: prod.productName,
        peso: "",
        minKg: "",
        maxKg: "",
        minPrecio: "",
        maxPrecio: "",
      }));

      setProductos(productosIniciales);
    }
  }, [location.state]);

  // Cambiar producto existente
  const handleChange = (id: number, field: keyof Producto, value: string) => {
    setProductos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // Cambiar producto nuevo (en la lista de nuevos)
  const handleNuevoProductoChange = (
    tempId: number,
    field: keyof Omit<Producto, "id">,
    value: string
  ) => {
    setNuevosProductos((prev) =>
      prev.map((p) => (p.tempId === tempId ? { ...p, [field]: value } : p))
    );
  };

  // Agregar nueva fila vacía
  const agregarFila = () => {
    const nuevoTempId =
      nuevosProductos.length > 0
        ? nuevosProductos[nuevosProductos.length - 1].tempId + 1
        : 1;

    setNuevosProductos((prev) => [
      ...prev,
      {
        tempId: nuevoTempId,
        nombre: "",
        peso: "",
        minKg: "",
        maxKg: "",
        minPrecio: "",
        maxPrecio: "",
      },
    ]);
  };

  // Eliminar fila de nuevos productos
  const eliminarFila = (tempId: number) => {
    setNuevosProductos((prev) => prev.filter((p) => p.tempId !== tempId));
  };

  // Validar que ninguna fila nueva esté parcialmente vacía (si hay filas)
  const validarNuevosProductos = () => {
    if (nuevosProductos.length === 0) return true;

    for (const prod of nuevosProductos) {
      const values = Object.values(prod)
        .filter((v) => typeof v !== "number")
        .map((v) => String(v));

      const anyFilled = values.some((v) => v.trim() !== "");
      const allFilled = values.every((v) => v.trim() !== "");

      if (anyFilled && !allFilled) {
        return false;
      }
    }
    return true;
  };

  // Confirmar la agregación
  const handleConfirmar = async () => {
    if (!validarNuevosProductos()) {
      toast.error(
        "Debes completar todos los campos de las filas nuevas o eliminar filas vacías."
      );
      return;
    }

    const productosParaAgregar = nuevosProductos.filter((p) =>
      Object.values(p)
        .filter((v) => typeof v !== "number")
        .every((v) => String(v).trim() !== "")
    );

    if (productosParaAgregar.length === 0) {
      navigate("/productos");
      return;
    }

    try {
      const response = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productosParaAgregar),
      });

      if (!response.ok) {
        throw new Error("Error al guardar productos");
      }

      toast.success("Productos agregados correctamente.");
      navigate("/productos");
    } catch (error) {
      toast.error("Hubo un error al guardar los productos.");
      console.error(error);
    }
  };

  return (
    <div className="space-y-6 ml-6">
      <div className="flex items-center gap-4">
        <Package className="h-12 w-12 text-primary" />
        <div>
          <h1 className="text-2xl font-semibold">Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Agrega un nuevo producto a tu catálogo
          </p>
        </div>
      </div>

      <div>
        <Select value={selectedProducto} onValueChange={setSelectedProducto}>
          <SelectTrigger className="h-11 w-[300px] text-base">
            <SelectValue placeholder="Selecciona un producto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Papel Folcote">Papel Folcote</SelectItem>
            <SelectItem value="Papel Couché">Papel Couché</SelectItem>
            <SelectItem value="Papel Bond">Papel Bond</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <hr className="border-t border-gray-300 my-4" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Producto</TableHead>
            <TableHead className="text-center w-[70px]">Peso</TableHead>
            <TableHead className="text-center w-[70px]">Kg Min</TableHead>
            <TableHead className="text-center w-[70px]">Kg Max</TableHead>
            <TableHead className="text-center w-[90px]">
              Precio Min ($)
            </TableHead>
            <TableHead className="text-center w-[90px]">
              Precio Max ($)
            </TableHead>
            <TableHead className="text-center w-[50px]">Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell className="w-[300px]">
                <Input
                  value={producto.nombre}
                  onChange={(e) =>
                    handleChange(producto.id, "nombre", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.peso}
                  onChange={(e) =>
                    handleChange(producto.id, "peso", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.minKg}
                  onChange={(e) =>
                    handleChange(producto.id, "minKg", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxKg}
                  onChange={(e) =>
                    handleChange(producto.id, "maxKg", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.minPrecio}
                  onChange={(e) =>
                    handleChange(producto.id, "minPrecio", e.target.value)
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxPrecio}
                  onChange={(e) =>
                    handleChange(producto.id, "maxPrecio", e.target.value)
                  }
                />
              </TableCell>
              <TableCell />
            </TableRow>
          ))}

          {/* Nuevas filas agregadas */}
          {nuevosProductos.map((producto) => (
            <TableRow key={producto.tempId} className="bg-gray-50">
              <TableCell className="w-[300px]">
                <Input
                  value={producto.nombre}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "nombre",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.peso}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "peso",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.minKg}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "minKg",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[70px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxKg}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "maxKg",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.minPrecio}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "minPrecio",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[90px]">
                <Input
                  className="w-full text-center"
                  value={producto.maxPrecio}
                  onChange={(e) =>
                    handleNuevoProductoChange(
                      producto.tempId,
                      "maxPrecio",
                      e.target.value
                    )
                  }
                />
              </TableCell>
              <TableCell className="text-center w-[50px]">
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

          {/* Fila para botón + */}
        </TableBody>
      </Table>

      {/* Botones al final */}
      <div className="fixed bottom-6 right-6 flex gap-3">
        <Button variant="outline" onClick={() => navigate(-1)}>
          Anterior
        </Button>
        <Button onClick={handleConfirmar}>Confirmar</Button>
      </div>
    </div>
  );
}
