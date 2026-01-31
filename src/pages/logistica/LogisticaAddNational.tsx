"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, ShoppingBag, Hash } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import TableAddNational from "@/components/common/Logistica/TableAddNational";
import type { ProductoNacionalRow } from "@/components/common/Logistica/TableAddNational";
import PDFAdjunto from "@/components/common/Logistica/PDF.Adjunt";

import { CompraNacionalService } from "@/services/national/compra-nacional.service";
import { SeriesRepository } from "@/repository/ventas/series.repository";

export default function LogisticaAddNacional() {
    const navigate = useNavigate();

    /* ===============================
       ESTADOS
    =============================== */
    const [proveedorId, setProveedorId] = useState<number | null>(null);
    const [items, setItems] = useState<ProductoNacionalRow[]>([]);
    const [adjuntos, setAdjuntos] = useState<
        { url: string; nombre_archivo: string }[]
    >([]);

    const [tipoComprobante, setTipoComprobante] = useState<
        "COMPRA_NACIONAL_FACTURA" | "COMPRA_NACIONAL_BOLETA"
    >("COMPRA_NACIONAL_FACTURA");

    const [seriePreview, setSeriePreview] = useState<string>("---");

    /* ===============================
       SERIES (PREVIEW)
    =============================== */
    useEffect(() => {
        const cargarSerie = async () => {
            try {
                const { data } = await SeriesRepository.obtenerInfoSerie(
                    tipoComprobante
                );

                if (!data) {
                    setSeriePreview("---");
                    return;
                }

                const numero = (data.ultimo_numero + 1)
                    .toString()
                    .padStart(8, "0");

                setSeriePreview(`${data.serie}-${numero}`);
            } catch {
                setSeriePreview("---");
            }
        };

        cargarSerie();
    }, [tipoComprobante]);

    /* ===============================
       TOTALES
    =============================== */
    const subtotal = items.reduce(
        (acc, item) =>
            acc +
            (Number(item.cantidad) || 0) *
            (Number(item.precioUnitario) || 0),
        0
    );

    const igv = subtotal * 0.18;
    const total = subtotal + igv;

    /* ===============================
       GUARDAR COMPRA (REGISTRADO)
    =============================== */
    const handleGuardar = async () => {
        if (!proveedorId) {
            toast.error("Debe seleccionar un proveedor");
            return;
        }

        if (items.length === 0) {
            toast.error("Debe agregar al menos un ítem");
            return;
        }

        try {
            const payload = {
                proveedor_id: proveedorId,
                tipo_comprobante: tipoComprobante,

                subtotal,
                igv,
                total_monto: total,

                moneda: "USD",
                observaciones: "",

                // ❗ NO SE DEFINE ESTADO → backend lo pone en REGISTRADO
                items: items.map((i) => ({
                    producto_id: i.producto_id ?? null,
                    descripcion: i.descripcion,
                    cantidad: Number(i.cantidad),
                    precio_unitario: Number(i.precioUnitario),
                    subtotal:
                        Number(i.cantidad) * Number(i.precioUnitario),
                })),

                adjuntos,
            };

            await CompraNacionalService.crearCompra(payload);

            toast.success("Compra registrada correctamente (estado: Registrado)");
            navigate("/logistica?tab=compras");
        } catch (error) {
            console.error(error);
            toast.error("Error al registrar la compra");
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">

            {/* ================= HEADER ================= */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Nueva Compra Nacional</h1>
                        <p className="text-sm text-muted-foreground">
                            Registro administrativo de compra (sin impacto en stock)
                        </p>
                    </div>
                </div>

                <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleGuardar}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Compra
                </Button>
            </div>

            {/* ================= DATOS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-emerald-500" />
                            Datos del Comprobante
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-2 gap-4">
                        {/* PROVEEDOR */}
                        <div className="col-span-2 space-y-2">
                            <Label>Proveedor</Label>
                            <Select onValueChange={(v) => setProveedorId(Number(v))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar proveedor..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">Proveedor Local S.A.C.</SelectItem>
                                    <SelectItem value="2">Distribuidora General</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* TIPO COMPROBANTE */}
                        <div className="space-y-2">
                            <Label>Tipo Comprobante</Label>
                            <Select
                                value={tipoComprobante}
                                onValueChange={(v: any) => setTipoComprobante(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="COMPRA_NACIONAL_FACTURA">
                                        Factura
                                    </SelectItem>
                                    <SelectItem value="COMPRA_NACIONAL_BOLETA">
                                        Boleta
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* SERIE */}
                        <div className="space-y-2">
                            <Label>Número de Comprobante</Label>
                            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
                                <Hash className="w-4 h-4 text-muted-foreground" />
                                <span className="font-mono font-semibold">
                                    {seriePreview}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ================= RESUMEN ================= */}
                <Card>
                    <CardHeader>
                        <CardTitle>Resumen</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span>Subtotal</span>
                            <span>$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>IGV (18%)</span>
                            <span>$ {igv.toFixed(2)}</span>
                        </div>
                        <div className="pt-3 border-t flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span className="text-emerald-600">
                                $ {total.toFixed(2)}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ================= ADJUNTOS ================= */}
            <PDFAdjunto onChangeFiles={setAdjuntos} />

            {/* ================= TABLA ================= */}
            <TableAddNational onChange={setItems} />

        </div>
    );
}
