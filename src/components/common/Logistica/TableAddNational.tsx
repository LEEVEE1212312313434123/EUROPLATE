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

/* =======================
   TIPOS
======================= */
export interface ProductoNacionalRow {
    tempId: number;
    producto_id?: number | null;
    categoria: string;
    descripcion: string;
    cantidad: string;
    unidadMedida: string;
    precioUnitario: string;
    importe: string;
}

interface Props {
    initialData?: ProductoNacionalRow[];
    onChange: (rows: ProductoNacionalRow[]) => void;
}

const UNIDADES = ["Unidad", "Paquete", "Caja", "Docena", "Servicio"];

/* =======================
   COMPONENTE
======================= */
export default function TableAddNational({
    initialData = [],
    onChange,
}: Props) {
    const { products, loading } = useProducts();

    const [rows, setRows] = useState<ProductoNacionalRow[]>(
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
                    importe: "",
                },
            ]
    );

    /* =======================
       CATEGORÍAS ÚNICAS
    ======================= */
    const categorias = useMemo(() => {
        const set = new Set(products.map((p) => p.categoria));
        return Array.from(set);
    }, [products]);

    /* =======================
       EMITIR CAMBIOS
    ======================= */
    useEffect(() => {
        onChange(rows);
    }, [rows, onChange]);

    /* =======================
       HELPERS
    ======================= */
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

    const getProductosPorCategoria = (categoria: string) => {
        if (!categoria || categoria === "SERVICIO") return [];
        return products.filter((p) => p.categoria === categoria);
    };

    /* =======================
       HANDLER
    ======================= */
    const handleChange = (
        tempId: number,
        field: keyof ProductoNacionalRow,
        value: string
    ) => {
        setRows((prev) =>
            prev.map((row) => {
                if (row.tempId !== tempId) return row;

                let actualizado: ProductoNacionalRow = {
                    ...row,
                    [field]: value,
                };

                /* Cambio de categoría */
                if (field === "categoria") {
                    actualizado = {
                        ...actualizado,
                        descripcion: "",
                        producto_id: null,
                        unidadMedida: "",
                        precioUnitario: "",
                        importe: "",
                    };
                }

                /* Selección de producto */
                if (field === "descripcion" && row.categoria !== "SERVICIO") {
                    const prodSel = products.find(
                        (p) => buildProductName(p) === value
                    );

                    if (prodSel) {
                        actualizado.producto_id = prodSel.id;
                        actualizado.unidadMedida =
                            prodSel.material?.unidad_medida || "Unidad";
                        actualizado.precioUnitario = String(
                            prodSel.precio?.precio_min || 0
                        );
                    }
                }

                /* Recalcular importe */
                if (field === "cantidad" || field === "precioUnitario") {
                    const cantidadNum = parseFloat(actualizado.cantidad) || 0;
                    const precioNum = parseFloat(actualizado.precioUnitario) || 0;
                    actualizado.importe = (cantidadNum * precioNum).toFixed(2);
                }

                return actualizado;
            })
        );
    };

    /* =======================
       AGREGAR FILA
    ======================= */
    const agregarFila = () => {
        setRows((prev) => [
            ...prev,
            {
                tempId: prev.length ? prev[prev.length - 1].tempId + 1 : 1,
                producto_id: null,
                categoria: "",
                descripcion: "",
                cantidad: "",
                unidadMedida: "",
                precioUnitario: "",
                importe: "",
            },
        ]);
    };

    /* =======================
       RENDER
    ======================= */
    return (
        <div className="grid grid-cols-1 gap-6 mt-6">
            <h3 className="text-base font-semibold">Detalle de Compra Nacional</h3>

            {loading ? (
                <p className="text-sm text-muted-foreground">
                    Cargando productos...
                </p>
            ) : (
                <Table className="text-sm">
                    <TableHeader>
                        <TableRow className="h-8">
                            <TableHead className="text-center">Categoría</TableHead>
                            <TableHead className="text-center">Descripción</TableHead>
                            <TableHead className="text-center">Cantidad</TableHead>
                            <TableHead className="text-center">Unidad</TableHead>
                            <TableHead className="text-center">Precio</TableHead>
                            <TableHead className="text-center">Importe</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {rows.map((row) => {
                            const productosCategoria = getProductosPorCategoria(
                                row.categoria
                            );

                            return (
                                <TableRow key={row.tempId}>
                                    {/* Categoría */}
                                    <TableCell>
                                        <Select
                                            value={row.categoria}
                                            onValueChange={(v) =>
                                                handleChange(row.tempId, "categoria", v)
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
                                                <SelectItem value="SERVICIO">Servicio</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>

                                    {/* Descripción */}
                                    <TableCell>
                                        {row.categoria === "SERVICIO" ? (
                                            <Input
                                                value={row.descripcion}
                                                onChange={(e) =>
                                                    handleChange(
                                                        row.tempId,
                                                        "descripcion",
                                                        e.target.value
                                                    )
                                                }
                                                className="h-7"
                                                placeholder="Descripción del servicio"
                                            />
                                        ) : (
                                            <Select
                                                value={row.descripcion}
                                                onValueChange={(v) =>
                                                    handleChange(row.tempId, "descripcion", v)
                                                }
                                                disabled={!row.categoria}
                                            >
                                                <SelectTrigger className="h-7">
                                                    <SelectValue placeholder="Selecciona..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {productosCategoria.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={buildProductName(p)}
                                                        >
                                                            {buildProductName(p)}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    </TableCell>

                                    {/* Cantidad */}
                                    <TableCell>
                                        <Input
                                            type="number"
                                            value={row.cantidad}
                                            onChange={(e) =>
                                                handleChange(row.tempId, "cantidad", e.target.value)
                                            }
                                            className="h-7"
                                        />
                                    </TableCell>

                                    {/* Unidad */}
                                    <TableCell>
                                        <Select
                                            value={row.unidadMedida}
                                            onValueChange={(v) =>
                                                handleChange(row.tempId, "unidadMedida", v)
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

                                    {/* Precio */}
                                    <TableCell>
                                        <Input
                                            value={row.precioUnitario}
                                            onChange={(e) =>
                                                handleChange(
                                                    row.tempId,
                                                    "precioUnitario",
                                                    e.target.value
                                                )
                                            }
                                            className="h-7"
                                        />
                                    </TableCell>

                                    {/* Importe */}
                                    <TableCell>
                                        <Input
                                            value={row.importe}
                                            readOnly
                                            className="h-7 bg-muted"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        <TableRow>
                            <TableCell colSpan={6}>
                                <Button
                                    variant="ghost"
                                    onClick={agregarFila}
                                    className="flex gap-2"
                                >
                                    <PlusCircle size={18} />
                                    Agregar ítem
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            )}
        </div>
    );
}
