"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    Box,
    Layers,
    Tag,
    Settings2,
    ChevronRight
} from "lucide-react"

// Importación de tus componentes de creación
import CrearProducto from "@/pages/general/CreateProducto"
import CrearVarianteProducto from "@/pages/general/CrearVarianteProducto"
import AtributosManager from "@/pages/general/AtributosManager"
import AsignarAtributosProducto from "@/pages/general/AsignarAtributosProducto"

export default function EnglobarCreacionProducto() {
    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            {/* CABECERA */}
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <Box className="text-emerald-600" />
                    Configuración de Productos
                </h1>
                <p className="text-muted-foreground">
                    Define la estructura base, variantes y atributos de tu catálogo.
                </p>
            </div>

            <Separator />

            <Tabs defaultValue="base" className="w-full">
                {/* NAVEGACIÓN DE PASOS */}
                <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 mb-8 h-auto p-1 bg-slate-100">
                    <TabsTrigger value="base" className="py-3 gap-2">
                        <Box className="h-4 w-4" />
                        1. Producto Base
                    </TabsTrigger>
                    <TabsTrigger value="variantes" className="py-3 gap-2">
                        <Layers className="h-4 w-4" />
                        2. Variantes
                    </TabsTrigger>
                    <TabsTrigger value="atributos" className="py-3 gap-2">
                        <Tag className="h-4 w-4" />
                        3. Definir Atributos
                    </TabsTrigger>
                    <TabsTrigger value="asignacion" className="py-3 gap-2">
                        <Settings2 className="h-4 w-4" />
                        4. Asignar Valores
                    </TabsTrigger>
                </TabsList>

                {/* CONTENIDO 1: CREAR PRODUCTO BASE */}
                <TabsContent value="base" className="animate-in fade-in-50 duration-500">
                    <Card className="border-none shadow-sm bg-white/50 border border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Información General</CardTitle>
                            <CardDescription>Crea la entidad principal del producto.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CrearProducto />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTENIDO 2: CREAR VARIANTES */}
                <TabsContent value="variantes" className="animate-in fade-in-50 duration-500">
                    <Card className="border-none shadow-sm bg-white/50 border border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Gestión de Variantes</CardTitle>
                            <CardDescription>Define SKUs y precios específicos para cada modelo.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <CrearVarianteProducto />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTENIDO 3: GESTIÓN DE ATRIBUTOS */}
                <TabsContent value="atributos" className="animate-in fade-in-50 duration-500">
                    <Card className="border-none shadow-sm bg-white/50 border border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Diccionario de Atributos</CardTitle>
                            <CardDescription>Configura tallas, colores, materiales o tipos de envase.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AtributosManager />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* CONTENIDO 4: ASIGNAR ATRIBUTOS */}
                <TabsContent value="asignacion" className="animate-in fade-in-50 duration-500">
                    <Card className="border-none shadow-sm bg-white/50 border border-slate-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xl">Vinculación Técnica</CardTitle>
                            <CardDescription>Asigna los atributos creados a las variantes correspondientes.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AsignarAtributosProducto />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>

            {/* FOOTER DE AYUDA */}
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-lg flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-full">
                    <ChevronRight className="h-4 w-4 text-emerald-600" />
                </div>
                <p className="text-sm text-emerald-800 italic">
                    <strong>Tip:</strong> Sigue el orden de las pestañas de izquierda a derecha para asegurar que todos los datos estén vinculados correctamente.
                </p>
            </div>
        </div>
    )
}