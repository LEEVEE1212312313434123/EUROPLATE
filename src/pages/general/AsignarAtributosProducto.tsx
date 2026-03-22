"use client"

import { useEffect, useState } from "react"
import { productoVariantesService } from "@/services/general/productoVariantes.service"

// Componentes de Shadcn UI
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Settings2, Save, PackageCheck, ListChecks, Loader2 } from "lucide-react"

// Importación de Sonner
import { toast } from "sonner"

type Producto = {
    id: number
    nombre: string
}

type Atributo = {
    id: number
    nombre: string
}

export default function AsignarAtributosProducto() {
    const [productos, setProductos] = useState<Producto[]>([])
    const [atributos, setAtributos] = useState<Atributo[]>([])
    const [productoId, setProductoId] = useState<number | null>(null)
    const [seleccionados, setSeleccionados] = useState<number[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(false)

    useEffect(() => {
        cargarDatos()
    }, [])

    async function cargarDatos() {
        try {
            const [productosData, atributosData] = await Promise.all([
                productoVariantesService.obtenerProductos(),
                productoVariantesService.obtenerAtributosGlobales()
            ])
            setProductos(productosData || [])
            setAtributos(atributosData || [])
        } catch (error) {
            console.error("Error cargando datos iniciales", error)
            toast.error("Error al cargar la lista de productos")
        }
    }

    async function seleccionarProducto(id: string) {
        const idNum = Number(id)
        setProductoId(idNum)
        setFetching(true)

        try {
            const attrs = await productoVariantesService.obtenerAtributos(idNum)
            const ids = attrs.map((a: any) => a.id)
            setSeleccionados(ids)
        } catch (error) {
            console.error("Error obteniendo atributos del producto", error)
            toast.error("No se pudieron cargar los atributos del producto seleccionado")
        } finally {
            setFetching(false)
        }
    }

    function toggleAtributo(atributoId: number) {
        setSeleccionados(prev => {
            if (prev.includes(atributoId)) {
                return prev.filter(a => a !== atributoId)
            }
            return [...prev, atributoId]
        })
    }

    async function guardar() {
        if (!productoId) return
        setLoading(true)

        const promise = productoVariantesService.asignarAtributosProducto(
            productoId,
            seleccionados
        )

        toast.promise(promise, {
            loading: 'Guardando cambios...',
            success: () => {
                setLoading(false)
                return 'Atributos asignados correctamente'
            },
            // ✅ CORRECCIÓN: Se usa () o (_) para evitar el error de variable no usada
            error: () => {
                setLoading(false)
                return 'Error al asignar atributos'
            },
        })
    }

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
            <Card className="shadow-lg border-slate-200 overflow-hidden">
                <CardHeader className="space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Settings2 className="w-6 h-6" />
                        <CardTitle className="text-2xl font-bold">Asignación de Atributos</CardTitle>
                    </div>
                    <CardDescription>
                        Define qué características (Talla, Color, etc.) se aplicarán al producto base.
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="producto" className="text-sm font-semibold text-slate-700">
                            Seleccionar Producto
                        </Label>
                        <Select onValueChange={seleccionarProducto}>
                            <SelectTrigger className="w-full bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Busca un producto..." />
                            </SelectTrigger>
                            <SelectContent>
                                {productos.map(p => (
                                    <SelectItem key={p.id} value={p.id.toString()}>
                                        <div className="flex items-center gap-2">
                                            <PackageCheck className="w-4 h-4 text-indigo-500" />
                                            {p.nombre}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    {productoId ? (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <ListChecks className="w-5 h-5 text-slate-500" />
                                    <h3 className="font-semibold text-slate-700">Atributos Disponibles</h3>
                                </div>
                                {fetching && <Loader2 className="w-4 h-4 animate-spin text-indigo-500" />}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {atributos.map(a => (
                                    <div
                                        key={a.id}
                                        className={`flex items-center space-x-3 p-3 rounded-lg border transition-all cursor-pointer ${seleccionados.includes(a.id)
                                            ? 'border-indigo-200 bg-indigo-50/50'
                                            : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                                            }`}
                                        onClick={() => toggleAtributo(a.id)}
                                    >
                                        <Checkbox
                                            id={`attr-${a.id}`}
                                            checked={seleccionados.includes(a.id)}
                                            onCheckedChange={() => toggleAtributo(a.id)}
                                            className="data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                                        />
                                        <Label
                                            htmlFor={`attr-${a.id}`}
                                            className="text-sm font-medium leading-none cursor-pointer flex-grow"
                                        >
                                            {a.nombre}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="flex flex-col items-center gap-2">
                                <PackageCheck className="w-8 h-8 text-slate-300" />
                                <p className="text-slate-400 text-sm font-medium">
                                    Elige un producto para gestionar sus propiedades
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-end border-t bg-slate-50/30 p-6">
                    <Button
                        onClick={guardar}
                        disabled={!productoId || loading || fetching}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[160px] gap-2 shadow-md shadow-indigo-100 transition-all active:scale-95"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}