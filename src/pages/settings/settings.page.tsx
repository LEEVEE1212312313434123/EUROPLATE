"use client";

import { useNavigate } from "react-router-dom";
import {
    Coins,
    RefreshCcw,
    ArrowLeft,
    Settings2,
    Package,
    Store,
    ShieldAlert, // Nuevo icono para Avanzado
    Zap
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
            path: "/settings/categorias",
        },
        {
            title: "Sucursales",
            description: "Administrar sedes y almacenes logísticos",
            icon: <Store className="h-8 w-8 text-purple-500" />,
            path: "/settings/sucursales",
        },
        // --- NUEVA OPCIÓN ---
        {
            title: "Configuración Avanzada",
            description: "Parámetros críticos, registros de sistema y API",
            icon: <ShieldAlert className="h-8 w-8 text-red-500" />,
            path: "/configuracion/configuracion-avanzada",
        },
    ];

    return (
        <div className="container mx-auto py-10 px-4 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                        <Settings2 className="h-8 w-8 text-primary" />
                        Configuración del Sistema
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Gestiona los parámetros generales y preferencias de tu plataforma.
                    </p>
                </div>
                <Button variant="outline" onClick={() => navigate("/")} className="gap-2 shadow-sm">
                    <ArrowLeft size={16} /> Volver al Inicio
                </Button>
            </div>

            {/* Grid de Opciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menuOptions.map((option, index) => (
                    <Card
                        key={index}
                        className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-slate-200 hover:border-primary/40"
                        onClick={() => navigate(option.path)}
                    >
                        <CardHeader className="z-10 relative">
                            <div className="mb-4 p-3 rounded-xl bg-slate-50 w-fit group-hover:scale-110 transition-transform duration-300">
                                {option.icon}
                            </div>
                            <CardTitle className="group-hover:text-primary transition-colors">
                                {option.title}
                            </CardTitle>
                            <CardDescription className="leading-relaxed">
                                {option.description}
                            </CardDescription>
                        </CardHeader>
                        {/* Sutil gradiente de fondo al hacer hover */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Card>
                ))}
            </div>

            {/* Footer / Nota informativa */}
            <div className="mt-12 p-5 bg-blue-50/50 border border-blue-100 rounded-xl flex items-start gap-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Zap size={20} className="text-blue-600" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900">Nota de seguridad</h4>
                    <p className="text-sm text-blue-800/80">
                        Los cambios realizados en estas secciones afectan a toda la organización en tiempo real.
                        Asegúrese de validar los datos antes de guardar cambios en el <strong>Tipo de Cambio</strong> o <strong>Configuraciones Avanzadas</strong>.
                    </p>
                </div>
            </div>
        </div>
    );
}