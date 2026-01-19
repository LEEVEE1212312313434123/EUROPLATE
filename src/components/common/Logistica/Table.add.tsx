"use client";
import { useState, useEffect, useMemo } from "react";
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useProducts } from "@/hooks/useProducts";

interface ProductoRow {
  tempId: number;
  producto_id?: number | null;
  categoria: string;
  descripcion: string;
  cantidad: string;
  unidadMedida: string;
  precioUnitario: string;
  importeUsd: string;

  idBobina?: string;
}

interface Props {
  initialData?: ProductoRow[];
  onChange: (rows: ProductoRow[]) => void;
}

const UNIDADES = ["Paquete", "Pliego", "Unidad", "Docena"];

export default function TableAddImport({ initialData = [], onChange }: Props) {
  const { products, loading } = useProducts();
  const [productos, setProductos] = useState<ProductoRow[]>(() =>
    initialData.length > 0
      ? initialData
      : [
        {
          tempId: 1,
          producto_id: null,
          categoria: "",
          descripcion: "",
          cantidad: "",
          unidadMedida: "",
          precioUnitario: "",
          importeUsd: "",
          idBobina: "",
        },
      ]
  );

  const [filtrados, setFiltrados] = useState<any[]>([]);

  const categorias = useMemo(() => {
    const set = new Set(products.map((p) => p.categoria));
    return Array.from(set);
  }, [products]);

  useEffect(() => {
    onChange(productos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productos]);

  const buildProductName = (p: any) => {
    const parts = [
      p.nombre_producto,
      p.material?.tipo,
      p.material?.dimensiones?.ancho_cm ? `${p.material.dimensiones.ancho_cm}cm` : "",
      p.material?.gramaje_g ? `${p.material.gramaje_g}g` : "",
      p.material?.calibre && p.material.calibre !== 0 ? `calibre ${p.material.calibre}` : "",
    ].filter(Boolean);
    return parts.join(" ");
  };

  const handleChange = (tempId: number, field: keyof ProductoRow, value: string) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.tempId !== tempId) return p;

        let actualizado = { ...p, [field]: value };

        if (field === "categoria") {
          const filtradosProd = products.filter((prod) => prod.categoria === value);
          setFiltrados(filtradosProd);
          actualizado.descripcion = "";
          actualizado.producto_id = null;
          actualizado.unidadMedida = "";
          actualizado.precioUnitario = "";
          actualizado.importeUsd = "";
        }

        if (field === "descripcion") {
          const prodSel = products.find((prod) => buildProductName(prod) === value);
          if (prodSel) {
            actualizado.producto_id = prodSel.id;
            actualizado.unidadMedida = prodSel.material.unidad_medida || "";
            actualizado.precioUnitario = String(prodSel.precio.precio_min || 0);
          }
        }

        // Recalcular importeUSD en cualquier cambio de cantidad o precioUnitario
        if (["cantidad", "precioUnitario"].includes(field)) {
          const cantidadNum = parseFloat(actualizado.cantidad) || 0;
          const precioNum = parseFloat(actualizado.precioUnitario) || 0;
          actualizado.importeUsd = (cantidadNum * precioNum).toFixed(2);
        }

        return actualizado;
      })
    );
  };
  const mostrarColumnaBobina = productos.some(p => p.categoria === "BobinasCarton");

  const agregarFila = () => {
    const newTempId = productos.length > 0 ? productos[productos.length - 1].tempId + 1 : 1;
    setProductos((prev) => [
      ...prev,
      {
        tempId: newTempId,
        producto_id: null,
        categoria: "",
        descripcion: "",
        cantidad: "",
        unidadMedida: "",
        precioUnitario: "",
        importeUsd: "",
        idBobina: "",
      },
    ]);
  };

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <div className="flex items-start gap-4">
        <h3 className="text-base font-semibold mb-4">Productos</h3>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Cargando productos...</p>
      ) : (
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="h-8">
              <TableHead className="px-2 text-center w-[160px]">Categoría Principal</TableHead>

              {mostrarColumnaBobina && (
                <TableHead className="px-2 text-center w-[120px]">ID Bobina</TableHead>
              )}

              <TableHead className="px-2 text-center w-[250px]">Descripción Producto</TableHead>
              <TableHead className="px-2 text-center w-[100px]">Cantidad</TableHead>
              <TableHead className="px-2 text-center w-[100px]">Unidad Medida</TableHead>
              <TableHead className="px-2 text-center w-[120px]">Costo</TableHead>
              <TableHead className="px-2 text-center w-[120px]">Importe (USD)</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.tempId} className="h-8">
                {/* Categoría */}
                <TableCell className="px-1 py-1">
                  <Select
                    value={producto.categoria}
                    onValueChange={(v) => handleChange(producto.tempId, "categoria", v)}
                  >
                    <SelectTrigger className="h-7 text-sm w-full">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat, i) => (
                        <SelectItem key={i} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* ID Bobina solo si es categoría BobinasCarton */}
                {mostrarColumnaBobina && (
                  <TableCell className="px-1 py-1">
                    {producto.categoria === "BobinasCarton" ? (
                      <Input
                        value={producto.idBobina}
                        onChange={(e) =>
                          handleChange(producto.tempId, "idBobina", e.target.value)
                        }
                        placeholder="ID"
                        className="h-7 text-sm w-full"
                      />
                    ) : (
                      <div className="text-center text-xs text-muted-foreground">—</div>
                    )}
                  </TableCell>
                )}
                {/* Descripción */}
                <TableCell className="px-1 py-1">
                  <Select
                    value={producto.descripcion}
                    onValueChange={(v) => handleChange(producto.tempId, "descripcion", v)}
                    disabled={!producto.categoria}
                  >
                    <SelectTrigger className="h-7 text-sm w-full">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filtrados.map((p, idx) => (
                        <SelectItem key={idx} value={buildProductName(p)}>
                          {buildProductName(p)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="px-1 py-1">
                  <Input
                    type="number"
                    value={producto.cantidad}
                    onChange={(e) => handleChange(producto.tempId, "cantidad", e.target.value)}
                    className="h-7 text-sm w-full"
                    placeholder="0"
                  />
                </TableCell>

                {/* Unidad de Medida como Select */}
                <TableCell className="px-1 py-1">
                  <Select
                    value={producto.unidadMedida}
                    onValueChange={(v) => handleChange(producto.tempId, "unidadMedida", v)}
                  >
                    <SelectTrigger className="h-7 text-sm w-full">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES.map((u, idx) => (
                        <SelectItem key={idx} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Precio Unitario editable */}
                <TableCell className="px-1 py-1">
                  <Input
                    value={producto.precioUnitario}
                    onChange={(e) =>
                      handleChange(producto.tempId, "precioUnitario", e.target.value)
                    }
                    className="h-7 text-sm w-full"
                    placeholder="0.00"
                  />
                </TableCell>

                <TableCell className="px-1 py-1">
                  <Input
                    value={producto.importeUsd}
                    readOnly
                    className="h-7 text-sm w-full bg-gray-50"
                  />
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={6} className="text-start py-1">
                <Button
                  variant="ghost"
                  onClick={agregarFila}
                  className="inline-flex items-center gap-1 rounded-full p-1 text-primary hover:bg-primary/20 cursor-pointer"
                >
                  <PlusCircle size={20} />
                  <span>Agregar producto</span>
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}
    </div>
  );
}
