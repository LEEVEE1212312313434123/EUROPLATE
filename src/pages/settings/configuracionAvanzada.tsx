"use client"

import { useState } from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Settings,
    ShieldAlert,
    Database,
    BellRing,
    Trash2,
    Layers,
} from "lucide-react"

// Importaciones de tus componentes operativos
import CrearProducto from "@/pages/general/CreateProducto"
import CrearVarianteProducto from "@/pages/general/CrearVarianteProducto"
import AtributosManager from "@/pages/general/AtributosManager"
import AsignarAtributosProducto from "@/pages/general/AsignarAtributosProducto"
import CrearCompra from "@/pages/general/CrearCompra"
import VentaPOS from "@/pages/general/VentaPOS"
import CrearNotaVenta from "@/pages/general/crearNotaVenta"
import TablaEliminarVariantes from "@/pages/general/TablaEliminarVariantes"

export default function ConfiguracionAvanzada() {
    const [activeTab, setActiveTab] = useState("general")

    return (
        <div className="flex flex-col space-y-6 p-6 bg-slate-50/30 min-h-screen">
            {/* Cabecera */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Configuración Avanzada</h1>
                    <p className="text-muted-foreground">Administra las preferencias críticas y módulos operativos del sistema.</p>
                </div>
            </div>

            <Separator />

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Navegación Lateral */}
                <aside className="lg:w-64">
                    <nav className="flex flex-col space-y-2">
                        {[
                            { id: "general", label: "Gestión General", icon: Settings },
                            { id: "seguridad", label: "Seguridad", icon: ShieldAlert },
                            { id: "datos", label: "Base de Datos", icon: Database },
                            { id: "notificaciones", label: "Alertas", icon: BellRing },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                variant={activeTab === item.id ? "secondary" : "ghost"}
                                className={`justify-start gap-3 h-11 ${activeTab === item.id ? "bg-white shadow-sm border-slate-200" : ""}`}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <item.icon className={`h-4 w-4 ${activeTab === item.id ? "text-blue-600" : "text-slate-500"}`} />
                                <span className="font-medium">{item.label}</span>
                            </Button>
                        ))}
                    </nav>
                </aside>

                {/* Contenido Principal */}
                <div className="flex-1">
                    {activeTab === "general" && (
                        <div className="space-y-8">
                            {/* Ajustes Básicos */}
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle>Identidad del Sistema</CardTitle>
                                    <CardDescription>Configura los datos básicos de tu instancia logística.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid gap-2 max-w-md">
                                        <Label htmlFor="site-name">Nombre de la Instancia</Label>
                                        <Input id="site-name" placeholder="Ej: Logística Central S.A." />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Módulos Operativos (Aquí van tus componentes) */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                    <Layers className="h-5 w-5 text-blue-600" />
                                    Módulos Operativos Centralizados
                                </h3>

                                <Tabs defaultValue="productos" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 h-auto p-1 bg-slate-100">
                                        <TabsTrigger value="productos" className="text-xs">Productos</TabsTrigger>
                                        <TabsTrigger value="variantes" className="text-xs">Variantes</TabsTrigger>
                                        <TabsTrigger value="atributos" className="text-xs">Atributos</TabsTrigger>
                                        <TabsTrigger value="compras" className="text-xs">Compras</TabsTrigger>
                                        <TabsTrigger value="ventas" className="text-xs">POS / Ventas</TabsTrigger>
                                        <TabsTrigger value="notas" className="text-xs">Notas</TabsTrigger>
                                        <TabsTrigger value="Eliminar_Variantes" className="text-xs">Eliminar Variantes</TabsTrigger>
                                    </TabsList>

                                    {/* Panel de Productos */}
                                    <TabsContent value="productos" className="mt-4 space-y-4">
                                        <CrearProducto />
                                    </TabsContent>

                                    {/* Panel de Variantes */}
                                    <TabsContent value="variantes" className="mt-4 space-y-6">
                                        <CrearVarianteProducto />
                                        <Separator />
                                        <AsignarAtributosProducto />
                                    </TabsContent>

                                    {/* Panel de Atributos */}
                                    <TabsContent value="atributos" className="mt-4">
                                        <AtributosManager />
                                    </TabsContent>

                                    {/* Panel de Compras */}
                                    <TabsContent value="compras" className="mt-4">
                                        <CrearCompra />
                                    </TabsContent>

                                    {/* Panel de Ventas */}
                                    <TabsContent value="ventas" className="mt-4">
                                        <VentaPOS />
                                    </TabsContent>

                                    {/* Panel de Notas */}
                                    <TabsContent value="notas" className="mt-4">
                                        <CrearNotaVenta />
                                    </TabsContent>

                                    {/* Panel de ELIMINAR VARIANTES */}
                                    <TabsContent value="Eliminar_Variantes" className="mt-4">
                                        <TablaEliminarVariantes />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </div>
                    )}

                    {activeTab === "seguridad" && (
                        <Card className="border-destructive/20 shadow-sm overflow-hidden">
                            <CardHeader className="bg-destructive/5 border-b border-destructive/10">
                                <CardTitle className="text-destructive flex items-center gap-2">
                                    <ShieldAlert className="h-5 w-5" /> Zona de Peligro
                                </CardTitle>
                                <CardDescription>Acciones críticas que afectan la integridad de los datos.</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold">Cerrar Sesiones Globales</p>
                                        <p className="text-xs text-muted-foreground">Invalida todos los tokens de acceso activos.</p>
                                    </div>
                                    <Button variant="outline" size="sm">Ejecutar</Button>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-sm font-semibold text-destructive">Hard Reset de Datos</p>
                                        <p className="text-xs text-muted-foreground">Esta acción borrará definitivamente las tablas de transacciones.</p>
                                    </div>
                                    <Button variant="destructive" size="sm" className="gap-2">
                                        <Trash2 className="h-4 w-4" /> Resetear Sistema
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Otros Placeholders */}
                    {(activeTab === "datos" || activeTab === "notificaciones") && (
                        <Card className="border-dashed shadow-none bg-transparent border-2">
                            <CardContent className="flex h-[300px] flex-col items-center justify-center space-y-2">
                                <Database className="h-10 w-10 text-slate-300" />
                                <p className="text-slate-500 font-medium">Módulo {activeTab.toUpperCase()} en mantenimiento</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}