"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { useSucursales } from "@/hooks/Data/useSucursales";

interface Props {
    value?: number | null;
    onChange: (id: number) => void;
}

export default function SucursalSelect({ value, onChange }: Props) {
    const { sucursales, loading } = useSucursales();

    if (loading) {
        return (
            <span className="text-xs text-muted-foreground">
                Cargando...
            </span>
        );
    }

    return (
        <Select
            value={value ? String(value) : ""}
            onValueChange={(v) => onChange(Number(v))}
        >
            <SelectTrigger className="h-7">
                <SelectValue placeholder="Sucursal" />
            </SelectTrigger>
            <SelectContent>
                {sucursales.map((sucursal) => (
                    <SelectItem
                        key={sucursal.id}
                        value={String(sucursal.id)}
                    >
                        {sucursal.nombre}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
