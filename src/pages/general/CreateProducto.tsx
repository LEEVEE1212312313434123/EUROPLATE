"use client"

import { useState } from "react"
import { productosService } from "@/services/general/productos.service"

// Componentes de Shadcn UI
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Loader2, Save, PackagePlus } from "lucide-react"

// Notificaciones con Sonner
import { toast } from "sonner"

export default function CrearProducto() {
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }

        setLoading(true)

        // Usamos toast.promise para una UX superior
        const promise = productosService.crearProducto({ nombre, descripcion })

        toast.promise(promise, {
            loading: 'Creando producto...',
            success: () => {
                setNombre("")
                setDescripcion("")
                return '¡Producto creado con éxito!'
            },
            error: (err) => {
                return err.message || 'Error al crear el producto'
            },
            finally: () => setLoading(false)
        })
    }

    return (
        <div className="flex justify-center items-start md:items-center min-h-[80vh] bg-transparent p-4">
            <Card className="w-full max-w-md shadow-xl border-slate-200 animate-in fade-in zoom-in-95 duration-300">
                <CardHeader className="space-y-1">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                        <div className="bg-blue-100 p-2 rounded-lg">
                            <PackagePlus className="h-5 w-5" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        Nuevo Producto Base
                    </CardTitle>
                    <CardDescription>
                        Registra la información general para el catálogo.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Input de Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-sm font-semibold">
                                Nombre del producto
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej. Laptop Gaming Pro"
                                className="focus-visible:ring-blue-500"
                                disabled={loading}
                                required
                            />
                        </div>

                        {/* Textarea de Descripción */}
                        <div className="space-y-2">
                            <Label htmlFor="descripcion" className="text-sm font-semibold">
                                Descripción (Opcional)
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Indica las características generales..."
                                className="min-h-[120px] resize-none focus-visible:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {loading ? "Procesando..." : "Guardar Producto"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}