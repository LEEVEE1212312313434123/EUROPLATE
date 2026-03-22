"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import {
    Plus,
    Tag,
    Layers,
    Loader2,
    LayoutGrid,
    Database
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"

type Atributo = {
    id: number
    nombre: string
}

type Valor = {
    id: number
    atributo_id: number
    valor: string
}

export default function AtributosManager() {

    const [atributos, setAtributos] = useState<Atributo[]>([])
    const [valores, setValores] = useState<Record<number, Valor[]>>({})
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)

    const [nuevoAtributo, setNuevoAtributo] = useState("")
    const [nuevoValor, setNuevoValor] = useState("")
    const [atributoSeleccionado, setAtributoSeleccionado] = useState<number | null>(null)

    async function cargarAtributos() {

        setLoading(true)

        try {

            const { data: attrs, error: errAttrs } = await supabase
                .from("atributos")
                .select("*")
                .order("nombre", { ascending: true })

            if (errAttrs) throw errAttrs

            if (attrs) {

                setAtributos(attrs)

                const { data: todosLosValores, error: errValores } =
                    await supabase
                        .from("atributo_valores")
                        .select("*")

                if (errValores) throw errValores

                const mapping: Record<number, Valor[]> = {}

                todosLosValores?.forEach(v => {

                    if (!mapping[v.atributo_id])
                        mapping[v.atributo_id] = []

                    mapping[v.atributo_id].push(v)

                })

                setValores(mapping)

            }

        } catch (error: any) {

            toast.error("Error al sincronizar con la base de datos")

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {
        cargarAtributos()
    }, [])

    async function crearAtributo() {

        if (!nuevoAtributo.trim()) return

        setActionLoading(true)

        const promise = (async () => {

            const { data, error } = await supabase
                .from("atributos")
                .insert({ nombre: nuevoAtributo })
                .select()
                .single()

            if (error) throw error

            return data

        })()

        toast.promise(promise, {

            loading: 'Creando nuevo atributo...',

            success: (data: any) => {

                if (data)
                    setAtributos([...atributos, data])

                setNuevoAtributo("")

                return `Atributo "${data.nombre}" creado exitosamente`

            },

            error: 'No se pudo crear el atributo',

            finally: () => setActionLoading(false)

        })

    }

    async function crearValor() {

        if (!atributoSeleccionado || !nuevoValor.trim()) return

        setActionLoading(true)

        const promise = (async () => {

            const { data, error } = await supabase
                .from("atributo_valores")
                .insert({
                    atributo_id: atributoSeleccionado,
                    valor: nuevoValor
                })
                .select()
                .single()

            if (error) throw error

            return data

        })()

        toast.promise(promise, {

            loading: 'Guardando nuevo valor...',

            success: (data: any) => {

                if (data) {

                    setValores(prev => ({
                        ...prev,
                        [atributoSeleccionado]: [
                            ...(prev[atributoSeleccionado] || []),
                            data
                        ]
                    }))

                }

                setNuevoValor("")

                return `Valor "${data.valor}" añadido correctamente`

            },

            error: 'Error al registrar el valor',

            finally: () => setActionLoading(false)

        })

    }

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">

                <div className="space-y-1">

                    <div className="flex items-center gap-2 text-indigo-600">
                        <Database className="w-6 h-6" />
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                            Gestión de Inventario
                        </h1>
                    </div>

                    <p className="text-muted-foreground text-sm md:text-base">
                        Configura los atributos globales y variantes técnicas de tus productos.
                    </p>

                </div>

                <Badge variant="outline" className="w-fit py-1.5 px-4 bg-white shadow-sm border-slate-200">
                    <span className="flex items-center gap-2 font-medium text-slate-600">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Sistema en Línea
                    </span>
                </Badge>

            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                <div className="lg:col-span-5 space-y-6">

                    <Card className="shadow-lg border-slate-200/60 overflow-hidden">

                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">

                            <CardTitle className="text-lg flex items-center gap-2 text-blue-600">
                                <Layers className="w-5 h-5" /> Nuevo Atributo
                            </CardTitle>

                            <CardDescription>
                                Categorías como Color, Talla, Material.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="pt-6">

                            <div className="flex gap-2">

                                <Input
                                    placeholder="Ej: Color, Talla..."
                                    value={nuevoAtributo}
                                    onChange={(e) => setNuevoAtributo(e.target.value)}
                                    disabled={actionLoading}
                                />

                                <Button
                                    onClick={crearAtributo}
                                    disabled={actionLoading || !nuevoAtributo.trim()}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >

                                    {actionLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : <Plus className="w-4 h-4 mr-2" />
                                    }

                                    Añadir

                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                    <Card className="shadow-lg border-slate-200/60 overflow-hidden">

                        <CardHeader className="bg-slate-50/50 border-b border-slate-100">

                            <CardTitle className="text-lg flex items-center gap-2 text-purple-600">
                                <Tag className="w-5 h-5" /> Añadir Valor
                            </CardTitle>

                            <CardDescription>
                                Opciones específicas para cada atributo.
                            </CardDescription>

                        </CardHeader>

                        <CardContent className="pt-6 space-y-4">

                            <Select
                                onValueChange={(v) => setAtributoSeleccionado(Number(v))}
                                value={atributoSeleccionado?.toString()}
                            >

                                <SelectTrigger>
                                    <SelectValue placeholder="Elige un atributo existente" />
                                </SelectTrigger>

                                <SelectContent>

                                    {atributos.map((a) => (

                                        <SelectItem key={a.id} value={a.id.toString()}>
                                            {a.nombre}
                                        </SelectItem>

                                    ))}

                                </SelectContent>

                            </Select>

                            <div className="flex gap-2">

                                <Input
                                    placeholder="Ej: Rojo, XL, 16GB..."
                                    value={nuevoValor}
                                    onChange={(e) => setNuevoValor(e.target.value)}
                                    disabled={!atributoSeleccionado || actionLoading}
                                />

                                <Button
                                    onClick={crearValor}
                                    disabled={!atributoSeleccionado || !nuevoValor.trim() || actionLoading}
                                    className="bg-purple-600 hover:bg-purple-700"
                                >
                                    {actionLoading
                                        ? <Loader2 className="w-4 h-4 animate-spin" />
                                        : "Guardar"}
                                </Button>

                            </div>

                        </CardContent>

                    </Card>

                </div>

                <Card className="lg:col-span-7 shadow-xl border-slate-200/60">

                    <CardHeader>

                        <div className="flex justify-between items-center">

                            <div className="flex items-center gap-2">
                                <LayoutGrid className="w-5 h-5 text-indigo-500" />
                                <CardTitle className="text-xl">
                                    Configuración Actual
                                </CardTitle>
                            </div>

                            <span className="text-xs text-slate-400 font-mono">
                                Total: {atributos.length}
                            </span>

                        </div>

                    </CardHeader>

                    <CardContent>

                        <ScrollArea className="h-[520px]">

                            {loading ? (

                                <div className="flex flex-col items-center justify-center py-24 gap-4">

                                    <Loader2 className="w-10 h-10 animate-spin text-indigo-400" />

                                    <p className="font-medium">
                                        Sincronizando datos...
                                    </p>

                                </div>

                            ) : (

                                <div className="space-y-4">

                                    {atributos.map((a) => (

                                        <div key={a.id} className="p-5 rounded-xl border">

                                            <div className="flex justify-between mb-3">

                                                <h4 className="font-bold uppercase text-sm">
                                                    {a.nombre}
                                                </h4>

                                                <span className="text-xs font-mono">
                                                    REF #{a.id}
                                                </span>

                                            </div>

                                            <Separator className="mb-3" />

                                            <div className="flex flex-wrap gap-2">

                                                {(valores[a.id] || []).length > 0
                                                    ? valores[a.id].map((v) => (

                                                        <Badge
                                                            key={v.id}
                                                            variant="outline"
                                                        >
                                                            {v.valor}
                                                        </Badge>

                                                    ))
                                                    : <p className="text-xs text-slate-400 italic">
                                                        Sin valores asignados
                                                    </p>
                                                }

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </ScrollArea>

                    </CardContent>

                </Card>

            </div>

        </div>
    )
}