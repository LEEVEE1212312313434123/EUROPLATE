"use client";

import { useEffect, useState } from "react";
import { MonedaService } from "@/services/monedas/moneda.service";
import type { MonedaEntity } from "@/types/moneda/entity/moneda.entity";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function MonedasPage() {
    const [monedas, setMonedas] = useState<MonedaEntity[]>([]);
    const [codigo, setCodigo] = useState("");
    const [nombre, setNombre] = useState("");
    const [simbolo, setSimbolo] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarMonedas();
    }, []);

    const cargarMonedas = async () => {
        try {
            const data = await MonedaService.listarMonedas();
            setMonedas(data);
        } catch (error: any) {
            alert(error.message);
        }
    };

    const crearMoneda = async () => {
        if (!codigo || !nombre) {
            alert("Código y nombre son obligatorios");
            return;
        }

        try {
            setLoading(true);

            await MonedaService.registrarMoneda({
                codigo: codigo.toUpperCase(),
                nombre,
                simbolo,
            });

            setCodigo("");
            setNombre("");
            setSimbolo("");

            await cargarMonedas();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Gestión de Monedas</h1>

            {/* Crear Moneda */}
            <Card className="p-4 space-y-4">
                <h2 className="font-semibold">Nueva Moneda</h2>

                <div className="grid grid-cols-3 gap-4">
                    <Input
                        placeholder="Código (USD)"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
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

                <Button onClick={crearMoneda} disabled={loading}>
                    {loading ? "Guardando..." : "Crear Moneda"}
                </Button>
            </Card>

            {/* Listado */}
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
        </div>
    );
}
