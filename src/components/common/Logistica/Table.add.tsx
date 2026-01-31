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

  const [productos, setProductos] = useState<ProductoRow[]>(
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

  /* ===============================
     CATEGORÍAS ÚNICAS
  =============================== */
  const categorias = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.categoria)));
  }, [products]);

  /* ===============================
     EMITIR CAMBIOS AL PADRE
  =============================== */
  useEffect(() => {
    onChange(productos);
  }, [productos, onChange]);

  /* ===============================
     HELPERS
  =============================== */
  const buildProductName = (p: any) => {
    const parts = [
      p.nombre_producto,
      p.material?.tipo,
      p.material?.dimensiones?.ancho_cm
        ? `${p.material.dimensiones.ancho_cm}cm`
        : "",
      p.material?.gramaje_g ? `${p.material.gramaje_g}g` : "",
      p.material?.calibre && p.material.calibre !== 0
        ? `calibre ${p.material.calibre}`
        : "",
    ].filter(Boolean);

    return parts.join(" ");
  };

  const handleChange = (
    tempId: number,
    field: keyof ProductoRow,
    value: string
  ) => {
    setProductos((prev) =>
      prev.map((p) => {
        if (p.tempId !== tempId) return p;

        let updated: ProductoRow = { ...p, [field]: value };

        if (field === "categoria") {
          updated.descripcion = "";
          updated.producto_id = null;
          updated.unidadMedida = "";
          updated.precioUnitario = "";
          updated.importeUsd = "";
          updated.idBobina = "";
        }

        if (field === "descripcion") {
          const prodSel = products.find(
            (prod) => buildProductName(prod) === value
          );

          if (prodSel) {
            updated.producto_id = prodSel.id;
            updated.unidadMedida =
              prodSel.material?.unidad_medida ?? "";
            updated.precioUnitario = String(
              prodSel.precio?.precio_min ?? 0
            );
          }
        }

        if (field === "cantidad" || field === "precioUnitario") {
          const cantidadNum = parseFloat(updated.cantidad) || 0;
          const precioNum = parseFloat(updated.precioUnitario) || 0;
          updated.importeUsd = (cantidadNum * precioNum).toFixed(2);
        }

        return updated;
      })
    );
  };

  const agregarFila = () => {
    setProductos((prev) => [
      ...prev,
      {
        tempId: prev.length
          ? prev[prev.length - 1].tempId + 1
          : 1,
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

  const mostrarColumnaBobina = productos.some(
    (p) => p.categoria === "BobinasCarton"
  );

  /* ===============================
     RENDER
  =============================== */
  if (loading) {
    return (
      <p className="text-sm text-muted-foreground">
        Cargando productos...
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <h3 className="text-base font-semibold">Productos</h3>

      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            <TableHead className="text-center w-[160px]">
              Categoría
            </TableHead>

            {mostrarColumnaBobina && (
              <TableHead className="text-center w-[120px]">
                ID Bobina
              </TableHead>
            )}

            <TableHead className="text-center w-[250px]">
              Producto
            </TableHead>
            <TableHead className="text-center w-[100px]">
              Cantidad
            </TableHead>
            <TableHead className="text-center w-[100px]">
              Unidad
            </TableHead>
            <TableHead className="text-center w-[120px]">
              Costo
            </TableHead>
            <TableHead className="text-center w-[120px]">
              Importe (USD)
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {productos.map((producto) => {
            const productosFiltrados = products.filter(
              (p) => p.categoria === producto.categoria
            );

            return (
              <TableRow key={producto.tempId} className="h-8">
                {/* Categoría */}
                <TableCell>
                  <Select
                    value={producto.categoria}
                    onValueChange={(v) =>
                      handleChange(producto.tempId, "categoria", v)
                    }
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* ID Bobina */}
                {mostrarColumnaBobina && (
                  <TableCell>
                    {producto.categoria === "BobinasCarton" ? (
                      <Input
                        className="h-7"
                        value={producto.idBobina}
                        onChange={(e) =>
                          handleChange(
                            producto.tempId,
                            "idBobina",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        —
                      </span>
                    )}
                  </TableCell>
                )}

                {/* Descripción */}
                <TableCell>
                  <Select
                    value={producto.descripcion}
                    onValueChange={(v) =>
                      handleChange(producto.tempId, "descripcion", v)
                    }
                    disabled={!producto.categoria}
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Selecciona..." />
                    </SelectTrigger>
                    <SelectContent>
                      {productosFiltrados.map((p) => {
                        const name = buildProductName(p);
                        return (
                          <SelectItem key={p.id} value={name}>
                            {name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Input
                    className="h-7"
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleChange(
                        producto.tempId,
                        "cantidad",
                        e.target.value
                      )
                    }
                  />
                </TableCell>

                <TableCell>
                  <Select
                    value={producto.unidadMedida}
                    onValueChange={(v) =>
                      handleChange(
                        producto.tempId,
                        "unidadMedida",
                        v
                      )
                    }
                  >
                    <SelectTrigger className="h-7">
                      <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES.map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>

                <TableCell>
                  <Input
                    className="h-7"
                    value={producto.precioUnitario}
                    onChange={(e) =>
                      handleChange(
                        producto.tempId,
                        "precioUnitario",
                        e.target.value
                      )
                    }
                  />
                </TableCell>

                <TableCell>
                  <Input
                    className="h-7 bg-gray-50"
                    readOnly
                    value={producto.importeUsd}
                  />
                </TableCell>
              </TableRow>
            );
          })}

          <TableRow>
            <TableCell colSpan={7}>
              <Button
                variant="ghost"
                onClick={agregarFila}
                className="flex items-center gap-2 text-primary"
              >
                <PlusCircle size={18} />
                Agregar producto
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
