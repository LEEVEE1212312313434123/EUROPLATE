"use client";

import { useNavigate } from "react-router-dom";
import {
    Coins,
    RefreshCcw,
    ArrowLeft,
    Settings2,
    Package,
    Store
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
    const navigate = useNavigate();

    const menuOptions = [
        {
            title: "Monedas",
            description: "Configura las divisas permitidas (USD, PEN, etc.)",
            icon: <Coins className="h-8 w-8 text-blue-500" />,
            path: "/configuracion/monedas",
        },
        {
            title: "Tipo de Cambio",
            description: "Actualiza las tasas de conversión diarias",
            icon: <RefreshCcw className="h-8 w-8 text-green-500" />,
            path: "/configuracion/tipo-cambio",
        },
        {
            title: "Categorías de Productos",
            description: "Gestionar Insumos, Mercadería y Productos Terminados",
            icon: <Package className="h-8 w-8 text-orange-500" />,
            path: "/settings/categorias", // Ruta ejemplo
        },
        {
            title: "Sucursales",
            description: "Administrar sedes y almacenes logísticos",
            icon: <Store className="h-8 w-8 text-purple-500" />,
            path: "/settings/sucursales", // Ruta ejemplo
        },
    ];

    return (
        <div className="container mx-auto py-10 px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Configuración del Sistema</h1>
                    <p className="text-muted-foreground">
                        Gestiona los parámetros generales y preferencias de tu plataforma.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/")} className="gap-2">
                    <ArrowLeft size={16} /> Volver al Inicio
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuOptions.map((option, index) => (
                    <Card
                        key={index}
                        className="hover:shadow-md transition-all cursor-pointer border-2 hover:border-primary/50"
                        onClick={() => navigate(option.path)}
                    >
                        <CardHeader>
                            <div className="mb-4">{option.icon}</div>
                            <CardTitle>{option.title}</CardTitle>
                            <CardDescription>{option.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>

            {/* Footer / Nota informativa */}
            <div className="mt-12 p-4 bg-muted rounded-lg flex items-center gap-3">
                <Settings2 className="text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                    Los cambios realizados en estas secciones afectan a toda la organización en tiempo real.
                </p>
            </div>
        </div>
    );
}