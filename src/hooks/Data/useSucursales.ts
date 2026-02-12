"use client";

import { useState, useEffect } from "react";

interface Sucursal {
    id: number;
    nombre: string;
}

export function useSucursales() {
    const [sucursales, setSucursales] = useState<Sucursal[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Simulamos una carga de datos
        const fetchSucursales = () => {
            const data: Sucursal[] = [
                { id: 1, nombre: "Lorenzo Farfan " },
                { id: 2, nombre: "Los heroes" },
            ];

            setSucursales(data);
            setLoading(false);
        };

        fetchSucursales();
    }, []);

    return { sucursales, loading };
}