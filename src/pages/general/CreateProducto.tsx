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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Loader2, Save, PackagePlus, Layers } from "lucide-react"
import { toast } from "sonner"

// Mantenemos la constante para referencia o si quieres mapear en el futuro
const TIPOS_PRODUCTO = [
    { value: "mercaderia", label: "Mercadería" },
    { value: "producto_terminado", label: "Producto terminado" },
    { value: "insumo", label: "Insumo" },
]

export default function CrearProducto() {
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const [tipo, setTipo] = useState("") // Guardará: "mercaderia", "producto_terminado" o "insumo"
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!nombre.trim()) {
            toast.error("El nombre del producto es obligatorio")
            return
        }

        if (!tipo) {
            toast.error("Debe seleccionar un tipo de producto")
            return
        }

        setLoading(true)

        // Enviamos el objeto con el 'tipo' corregido (snake_case)
        const promise = productosService.crearProducto({
            nombre,
            descripcion,
            tipo
        })

        toast.promise(promise, {
            loading: 'Configurando producto base...',
            success: () => {
                setNombre("")
                setDescripcion("")
                setTipo("")
                return '¡Producto base creado con éxito!'
            },
            error: (err) => err.message || 'Error al crear el producto',
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
                        Define la identidad principal para que sea filtrable en variantes.
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">

                        {/* Tipo de Producto con los valores técnicos correctos */}
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold flex items-center gap-2">
                                <Layers className="h-4 w-4 text-slate-500" />
                                Tipo de producto
                            </Label>
                            <Select
                                value={tipo}
                                onValueChange={setTipo}
                                disabled={loading}
                                required
                            >
                                <SelectTrigger className="focus:ring-blue-500 bg-slate-50/50">
                                    <SelectValue placeholder="Selecciona el uso operativo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {TIPOS_PRODUCTO.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                                placeholder="Ej. Camiseta Algodón Premium"
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
                                placeholder="Indica características generales..."
                                className="min-h-[100px] resize-none focus-visible:ring-blue-500"
                                disabled={loading}
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="pt-2">
                        <Button
                            type="submit"
                            disabled={loading || !tipo || !nombre}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] gap-2"
                        >
                            {loading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {loading ? "Guardando..." : "Registrar Producto Maestro"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}