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

// Estructura para productos normales
interface ProductoConPreciosDefault {
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
  peso?: string;
}

// Estructura para BobinasCarton
interface ProductoConPreciosBobina {
  tempId: number;
  tipo: string; // Grade
  dimensiones: string; // Type
  ancho: string; // Width
  gramaje: string; // Gsm
  unidad: string;
  productName: string;
  precioKgMin: string;
  precioKgMax: string;
  precioMin: string;
  precioMax: string;
  imagen?: string;
  peso?: string;
}

type ProductoConPrecios = ProductoConPreciosDefault | ProductoConPreciosBobina;

interface Props {
  navigate: any;
  productosPrevios: ProductoConPrecios[];
  categoria: string;
}

export default function ProductosAgregarPreciosForm({
  navigate,
  productosPrevios,
  categoria,
}: Props) {
  const [productos, setProductos] =
    useState<ProductoConPrecios[]>(productosPrevios);
  const [maxId, setMaxId] = useState<number>(0);

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
      const productosCompletos: Product[] = productosConPreciosValidos.map(
        (producto, idx) => {
          const nuevoId = maxId + idx + 1;

          if (categoria === "BobinasCarton") {
            const p = producto as ProductoConPreciosBobina;
            return {
              id: nuevoId,
              nombre_producto: p.productName,
              categoria: categoria,
              material: {
                tipo: p.tipo, // usamos "tipo" en lugar de grade
                dimensiones: {
                  ancho_cm: parseInt(p.ancho) || 0,
                  largo_cm: 0, // BobinasCarton no tiene largo → lo dejamos en 0
                },
                gramaje_g: parseInt(p.gramaje) || 0,
                calibre: 0,
                pliegos_por_paquete: 0,
                unidad_medida: p.unidad,
                peso_kg: parseFloat(p.peso || "0"),
              },
              precio: {
                precio_min: parseFloat(p.precioMin || "0"),
                precio_max: parseFloat(p.precioMax || "0"),
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
                p.imagen || "https://dummyimage.com/400x400/4c65bf/db398a",
              tipo: "producto",
            };
          } else {
            const p = producto as ProductoConPreciosDefault;
            return {
              id: nuevoId,
              nombre_producto: p.productName,
              categoria: categoria,
              material: {
                tipo: p.tipo,
                dimensiones: {
                  ancho_cm: parseInt(p.ancho) || 0,
                  largo_cm: parseInt(p.largo) || 0,
                },
                gramaje_g: parseInt(p.gramaje) || 0,
                calibre: parseInt(p.calibre) || 0,
                pliegos_por_paquete: parseInt(p.pliegos) || 0,
                unidad_medida: p.unidad,
                peso_kg: parseFloat(p.peso || "0"),
              },
              precio: {
                precio_min: parseFloat(p.precioMin || "0"),
                precio_max: parseFloat(p.precioMax || "0"),
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
                p.imagen || "https://dummyimage.com/400x400/4c65bf/db398a",
              tipo: "producto",
            };
          }
        }
      );

      if (productosCompletos.length > 0) {
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
              <TableCell className="px-2 py-1">{producto.productName}</TableCell>
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
