"use client";
import { useState, useEffect, useMemo } from "react";
import { PlusCircle } from "lucide-react";
import SucursalSelect from "@/components/common/Logistica/SucursalSelect";
import SearchableSelect from "@/components/common/Select/SearchableSelect";

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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

import { useProducts } from "@/hooks/useProducts";

interface ProductoRow {
  tempId: number;
  producto_id?: number | null;
  sucursal_id?: number | null;
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
  triggerValidate?: boolean;
}

const UNIDADES = ["Paquete", "Pliego", "Unidad", "Docena"];

export default function TableAddImport({
  initialData = [],
  onChange,
  triggerValidate = false,
}: Props) {
  const { products, loading } = useProducts();

  const [productos, setProductos] = useState<ProductoRow[]>(
    initialData.length > 0
      ? initialData
      : [
        {
          tempId: 1,
          producto_id: null,
          sucursal_id: null,
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

  const [errors, setErrors] = useState<Record<number, any>>({});

  /* ================= VALIDACIÓN ================= */
  useEffect(() => {
    if (!triggerValidate) return;

    const newErrors: any = {};

    productos.forEach((row) => {
      const rowErrors: any = {};

      if (!row.sucursal_id) rowErrors.sucursal_id = "Requerido";
      if (!row.categoria) rowErrors.categoria = "Requerido";
      if (!row.descripcion) rowErrors.descripcion = "Requerido";
      if (!row.cantidad || Number(row.cantidad) <= 0)
        rowErrors.cantidad = "Mayor a 0";
      if (!row.unidadMedida) rowErrors.unidadMedida = "Requerido";
      if (!row.precioUnitario || Number(row.precioUnitario) <= 0)
        rowErrors.precioUnitario = "Mayor a 0";

      if (Object.keys(rowErrors).length > 0) {
        newErrors[row.tempId] = rowErrors;
      }
    });

    setErrors(newErrors);
  }, [triggerValidate, productos]);

  useEffect(() => {
    onChange(productos);
  }, [productos, onChange]);

  const categorias = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.categoria)));
  }, [products]);

  const buildProductName = (p: any) => {
    const parts = [
      p.nombre_producto,
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
    value: any
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
        tempId: prev.length ? prev[prev.length - 1].tempId + 1 : 1,
        producto_id: null,
        sucursal_id: null,
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

  const inputError = (tempId: number, field: string) =>
    errors[tempId]?.[field] ? "border-red-500" : "";

  if (loading) {
    return <p className="text-sm text-muted-foreground">Cargando productos...</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 mt-6">
      <h3 className="text-base font-semibold">Productos</h3>

      <Table className="text-sm">
        <TableHeader>
          <TableRow className="h-8">
            <TableHead className="text-center w-[140px]">Sucursal</TableHead>
            <TableHead className="text-center w-[160px]">Categoría</TableHead>
            {mostrarColumnaBobina && (
              <TableHead className="text-center w-[120px]">
                ID Bobina
              </TableHead>
            )}
            <TableHead className="text-center w-[250px]">Producto</TableHead>
            <TableHead className="text-center w-[100px]">Cantidad</TableHead>
            <TableHead className="text-center w-[100px]">Unidad</TableHead>
            <TableHead className="text-center w-[120px]">Costo</TableHead>
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
                <TableCell>
                  <SucursalSelect
                    value={producto.sucursal_id ?? null}
                    onChange={(id) =>
                      handleChange(producto.tempId, "sucursal_id", id)
                    }
                  />
                </TableCell>

                {/* ✅ CATEGORIA SEARCHABLE */}
                <TableCell>
                  <SearchableSelect
                    value={producto.categoria}
                    placeholder="Buscar categoría..."
                    options={categorias.map((cat) => ({
                      label: cat,
                      value: cat,
                    }))}
                    onChange={(v) =>
                      handleChange(producto.tempId, "categoria", v)
                    }
                    className={inputError(producto.tempId, "categoria")}
                  />
                </TableCell>

                {mostrarColumnaBobina && (
                  <TableCell>
                    {producto.categoria === "BobinasCarton" ? (
                      <Input
                        className="h-7"
                        value={producto.idBobina}
                        onChange={(e) =>
                          handleChange(producto.tempId, "idBobina", e.target.value)
                        }
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
                    )}
                  </TableCell>
                )}

                {/* ✅ PRODUCTO SEARCHABLE */}
                <TableCell>
                  <SearchableSelect
                    value={producto.descripcion}
                    placeholder="Buscar producto..."
                    disabled={!producto.categoria}
                    options={productosFiltrados.map((p) => ({
                      label: buildProductName(p),
                      value: buildProductName(p),
                    }))}
                    onChange={(v) =>
                      handleChange(producto.tempId, "descripcion", v)
                    }
                    className={inputError(producto.tempId, "descripcion")}
                  />
                </TableCell>

                <TableCell>
                  <Input
                    className={`h-7 ${inputError(producto.tempId, "cantidad")}`}
                    value={producto.cantidad}
                    onChange={(e) =>
                      handleChange(producto.tempId, "cantidad", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <Select
                    value={producto.unidadMedida}
                    onValueChange={(v) =>
                      handleChange(producto.tempId, "unidadMedida", v)
                    }
                  >
                    <SelectTrigger className={`h-7 ${inputError(producto.tempId, "unidadMedida")}`}>
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
                    className={`h-7 ${inputError(producto.tempId, "precioUnitario")}`}
                    value={producto.precioUnitario}
                    onChange={(e) =>
                      handleChange(producto.tempId, "precioUnitario", e.target.value)
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
            <TableCell colSpan={8}>
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
