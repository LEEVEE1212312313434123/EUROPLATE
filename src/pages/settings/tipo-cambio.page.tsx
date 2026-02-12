"use client";

import { useEffect, useState } from "react";
import { MonedaService } from "@/services/monedas/moneda.service";
import { TipoCambioService } from "@/services/monedas/tipo-cambio.service";
import type { MonedaEntity } from "@/types/moneda/entity/moneda.entity";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

export default function TipoCambioPage() {
    const [monedas, setMonedas] = useState<MonedaEntity[]>([]);
    const [tiposCambio, setTiposCambio] = useState<any[]>([]);

    const [origenId, setOrigenId] = useState<string>("");
    const [destinoId, setDestinoId] = useState<string>("");
    const [fecha, setFecha] = useState("");
    const [compra, setCompra] = useState("");
    const [venta, setVenta] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarTodo();
    }, []);

    const cargarTodo = async () => {
        const monedasData = await MonedaService.listarMonedas();
        const tipoCambioData = await TipoCambioService.listarTiposCambio();

        setMonedas(monedasData);
        setTiposCambio(tipoCambioData);
    };

    const registrar = async () => {
        try {
            if (!origenId || !destinoId || !fecha || !compra || !venta) {
                alert("Todos los campos son obligatorios");
                return;
            }

            setLoading(true);

            await TipoCambioService.registrarTipoCambio({
                moneda_origen_id: Number(origenId),
                moneda_destino_id: Number(destinoId),
                fecha,
                compra: Number(compra),
                venta: Number(venta),
            });

            setCompra("");
            setVenta("");

            await cargarTodo();

            alert("Tipo de cambio registrado");
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Tipo de Cambio</h1>

            {/* FORMULARIO */}
            <Card className="p-4 space-y-4">
                <h2 className="font-semibold">Registrar Tipo de Cambio</h2>

                <div className="grid grid-cols-5 gap-4">
                    <Select value={origenId} onValueChange={setOrigenId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Moneda Origen" />
                        </SelectTrigger>
                        <SelectContent>
                            {monedas.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.codigo}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={destinoId} onValueChange={setDestinoId}>
                        <SelectTrigger>
                            <SelectValue placeholder="Moneda Destino" />
                        </SelectTrigger>
                        <SelectContent>
                            {monedas.map((m) => (
                                <SelectItem key={m.id} value={String(m.id)}>
                                    {m.codigo}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />

                    <Input
                        placeholder="Compra"
                        type="number"
                        value={compra}
                        onChange={(e) => setCompra(e.target.value)}
                    />

                    <Input
                        placeholder="Venta"
                        type="number"
                        value={venta}
                        onChange={(e) => setVenta(e.target.value)}
                    />
                </div>

                <Button onClick={registrar} disabled={loading}>
                    {loading ? "Guardando..." : "Guardar"}
                </Button>
            </Card>

            {/* LISTADO */}
            <Card className="p-4">
                <h2 className="font-semibold mb-4">Historial</h2>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Fecha</th>
                                <th className="p-2 border">Origen</th>
                                <th className="p-2 border">Destino</th>
                                <th className="p-2 border">Compra</th>
                                <th className="p-2 border">Venta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tiposCambio.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center p-4">
                                        No hay registros
                                    </td>
                                </tr>
                            )}

                            {tiposCambio.map((tc) => (
                                <tr key={tc.id}>
                                    <td className="p-2 border">{tc.fecha}</td>
                                    <td className="p-2 border">
                                        {tc.moneda_origen?.codigo}
                                    </td>
                                    <td className="p-2 border">
                                        {tc.moneda_destino?.codigo}
                                    </td>
                                    <td className="p-2 border">{tc.compra}</td>
                                    <td className="p-2 border">{tc.venta}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
