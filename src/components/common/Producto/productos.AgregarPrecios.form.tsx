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

interface ProductoConPrecios {
  tempId: number;
  tipo: string;
  dimensiones: string;
  ancho: string;
  largo: string;
  gramaje: string;
  calibre: string;
  pliegos: string;
  unidad: string;
  productName: string;
  precioKgMin: string;
  precioKgMax: string;
  precioMin: string;
  precioMax: string;
  imagen?: string;
  peso?: string; // Nueva propiedad para el peso
}

interface Props {
  navigate: any;
  productosPrevios: ProductoConPrecios[]; // productos del paso anterior
  categoria: string; // recibida desde Formulario1
}

export default function ProductosAgregarPreciosForm({
  navigate,
  productosPrevios,
  categoria,
}: Props) {
  const [productos, setProductos] =
    useState<ProductoConPrecios[]>(productosPrevios);
  const [maxId, setMaxId] = useState<number>(0);

  // Obtener el máximo ID
  useEffect(() => {
    const fetchMaxId = async () => {
      try {
        const id = await ProductService.getMaxId();
        setMaxId(id);
      } catch (error) {
        toast.error("Error al obtener el ID máximo");
        console.error("Error:", error);
      }
    };

    fetchMaxId();
  }, []);

  const handlePrecioChange = (
    tempId: number,
    field: keyof ProductoConPrecios,
    value: string
  ) => {
    setProductos((prev) =>
      prev.map((producto) =>
        producto.tempId === tempId ? { ...producto, [field]: value } : producto
      )
    );
  };

  const handleFinalizar = async () => {
    // Validación de precios mínimos y máximos
    const productosConPreciosValidos = productos.filter(
      (producto) =>
        producto.precioMin &&
        producto.precioMax &&
        !isNaN(Number(producto.precioMin)) &&
        !isNaN(Number(producto.precioMax)) &&
        producto.precioKgMin &&
        producto.precioKgMax &&
        !isNaN(Number(producto.precioKgMin)) &&
        !isNaN(Number(producto.precioKgMax))
    );

    if (productosConPreciosValidos.length !== productos.length) {
      toast.error("Completa todos los precios con valores válidos");
      return;
    }

    if (
      !Array.isArray(productosConPreciosValidos) ||
      productosConPreciosValidos.length === 0
    ) {
      toast.error("No hay productos para guardar");
      return;
    }

    try {
      // Mapear productos con precios completos
      const productosCompletos = productosConPreciosValidos.map(
        (producto, idx) => {
          const nuevoId = maxId + idx + 1;

          return {
            id: nuevoId,
            nombre_producto: producto.productName,
            categoria: categoria,
            material: {
              tipo: producto.tipo,
              dimensiones: {
                ancho_cm: parseInt(producto.ancho),
                largo_cm: parseInt(producto.largo),
              },
              gramaje_g: parseInt(producto.gramaje),
              calibre: parseInt(producto.calibre),
              pliegos_por_paquete: parseInt(producto.pliegos),
              unidad_medida: producto.unidad,
              peso_kg: parseFloat(producto.peso || "0"), // Nueva propiedad para el peso
            },
            precio: {
              precio_min: parseFloat(producto.precioMin || "0"),
              precio_max: parseFloat(producto.precioMax || "0"),
              precio_kg_min: parseFloat(producto.precioKgMin || "0"),
              precio_kg_max: parseFloat(producto.precioKgMax || "0"),
              moneda: "USD",
            },
            almacen: {
              stock_actual: 10,
              stock_minimo: 3,
              ubicacion: "Almacén Central - Estante A1",
            },
            estado: "Activo",
            accion: "Ver",
            fecha_registro: new Date().toISOString(),
            imagen:
              producto.imagen || "https://dummyimage.com/400x400/4c65bf/db398a",
            tipo: "producto",
          };
        }
      );

      if (productosCompletos.length > 0) {
        // Enviar TODOS los productos
        await ProductService.addMany(productosCompletos);
        toast.success("✅ Productos agregados correctamente");
        navigate("/products?tab=lista");
      }
    } catch (error: any) {
      toast.error("❌ Error al guardar los productos");
      console.error("Error:", error);
    }
  };

  return (
    <>
      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            {[
              "Producto",
              "Peso (kg)",
              "Precio por Kg (Min)",
              "Precio por Kg (Max)",
              "Precio Min ($)",
              "Precio Max ($)",
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
              <TableCell className="px-2 py-1">
                {`${categoria} ${producto.tipo} ${
                  producto.dimensiones ? `${producto.dimensiones} ` : ""
                }${
                  producto.ancho && producto.largo
                    ? `${producto.ancho}x${producto.largo} `
                    : ""
                }${producto.gramaje ? `${producto.gramaje}g ` : ""}calibre ${
                  producto.calibre ? `${producto.calibre} ` : ""
                }${producto.unidad ? `${producto.unidad.toLowerCase()} ` : ""}${
                  producto.pliegos ? `${producto.pliegos} pliegos` : ""
                }`}
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  value={producto.peso}
                  onChange={(e) =>
                    handlePrecioChange(producto.tempId, "peso", e.target.value)
                  }
                  className="h-7 text-sm"
                  type="number"
                  min="0"
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  value={producto.precioKgMin}
                  onChange={(e) =>
                    handlePrecioChange(
                      producto.tempId,
                      "precioKgMin",
                      e.target.value
                    )
                  }
                  className="h-7 text-sm"
                  type="number"
                  min="0"
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  value={producto.precioKgMax}
                  onChange={(e) =>
                    handlePrecioChange(
                      producto.tempId,
                      "precioKgMax",
                      e.target.value
                    )
                  }
                  className="h-7 text-sm"
                  type="number"
                  min="0"
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  value={producto.precioMin}
                  onChange={(e) =>
                    handlePrecioChange(
                      producto.tempId,
                      "precioMin",
                      e.target.value
                    )
                  }
                  className="h-7 text-sm"
                  type="number"
                  min="0"
                />
              </TableCell>
              <TableCell className="px-2 py-1">
                <Input
                  value={producto.precioMax}
                  onChange={(e) =>
                    handlePrecioChange(
                      producto.tempId,
                      "precioMax",
                      e.target.value
                    )
                  }
                  className="h-7 text-sm"
                  type="number"
                  min="0"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="fixed bottom-6 right-6 flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
          Atrás
        </Button>
        <Button size="sm" onClick={handleFinalizar}>
          Finalizar
        </Button>
      </div>
    </>
  );
}
