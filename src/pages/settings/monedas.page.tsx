"use client";

import { useEffect, useState } from "react";
import { MonedaService } from "@/services/monedas/moneda.service";
import { TipoCambioService } from "@/services/monedas/tipo-cambio.service";
import type { MonedaEntity } from "@/types/moneda/entity/moneda.entity";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";

export default function MonedasPage() {
    const [monedas, setMonedas] = useState<MonedaEntity[]>([]);
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [simbolo, setSimbolo] = useState("");

    const [fecha, setFecha] = useState("");
    const [compra, setCompra] = useState("");
    const [venta, setVenta] = useState("");

    const [origen, setOrigen] = useState("");
    const [destino, setDestino] = useState("");

    useEffect(() => {
        cargarMonedas();
    }, []);

    const cargarMonedas = async () => {
        const data = await MonedaService.listarMonedas();
        setMonedas(data);
    };

    const crearMoneda = async () => {
        if (!codigo || !nombre) return;

        await MonedaService.obtenerPorCodigo(codigo)
            .then((m) => {
                if (m) throw new Error("La moneda ya existe");
            });

        await MonedaService["constructor"].prototype.registrarMoneda?.();

        await MonedaService["listarMonedas"]();

        setCodigo("");
        setNombre("");
        setSimbolo("");

        cargarMonedas();
    };

    const registrarTipoCambio = async () => {
        await TipoCambioService.registrarTipoCambio({
            codigoOrigen: origen,
            codigoDestino: destino,
            fecha,
            compra: Number(compra),
            venta: Number(venta),
        });

        alert("Tipo de cambio registrado correctamente");

        setFecha("");
        setCompra("");
        setVenta("");
    };

    return (
        <div className="space-y-6">

            <h1 className="text-2xl font-bold">Monedas y Tipo de Cambio</h1>

            {/* CREAR MONEDA */}
            <Card className="p-4 space-y-4">
                <h2 className="font-semibold">Nueva Moneda</h2>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        placeholder="Código (USD)"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                    />
                    <Input
                        placeholder="Nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                    />
                    <Input
                        placeholder="Símbolo"
                        value={simbolo}
                        onChange={(e) => setSimbolo(e.target.value)}
                    />
                </div>

                <Button onClick={crearMoneda}>
                    Crear Moneda
                </Button>
            </Card>

            <Separator />

            {/* LISTADO MONEDAS */}
            <Card className="p-4">
                <h2 className="font-semibold mb-4">Monedas Registradas</h2>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Código</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Símbolo</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {monedas.map((m) => (
                            <TableRow key={m.id}>
                                <TableCell>{m.codigo}</TableCell>
                                <TableCell>{m.nombre}</TableCell>
                                <TableCell>{m.simbolo}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Separator />

            {/* REGISTRAR TIPO CAMBIO */}
            <Card className="p-4 space-y-4">
                <h2 className="font-semibold">Registrar Tipo de Cambio</h2>

                <div className="grid grid-cols-5 gap-4">
                    <Input
                        placeholder="Origen (USD)"
                        value={origen}
                        onChange={(e) => setOrigen(e.target.value.toUpperCase())}
                    />
                    <Input
                        placeholder="Destino (PEN)"
                        value={destino}
                        onChange={(e) => setDestino(e.target.value.toUpperCase())}
                    />
                    <Input
                        type="date"
                        value={fecha}
                        onChange={(e) => setFecha(e.target.value)}
                    />
                    <Input
                        placeholder="Compra"
                        value={compra}
                        onChange={(e) => setCompra(e.target.value)}
                    />
                    <Input
                        placeholder="Venta"
                        value={venta}
                        onChange={(e) => setVenta(e.target.value)}
                    />
                </div>

                <Button onClick={registrarTipoCambio}>
                    Guardar Tipo de Cambio
                </Button>
            </Card>
        </div>
    );
}
