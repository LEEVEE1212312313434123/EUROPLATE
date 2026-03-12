"use client"

import { useEffect, useState, useMemo } from "react"
import { productoVariantesService } from "@/services/general/productoVariantes.service"
import { useNavigate } from "react-router-dom";

// Componentes de Shadcn
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, PackageSearch, Settings2 } from "lucide-react";

// Tus componentes compartidos
import { ProductoSelector } from "@/pages/general/share/producto-variantes/ProductoSelector"
import { VariantesExistentes } from "@/pages/general/share/producto-variantes/VariantesExistentes"
import { AtributosSelector } from "@/pages/general/share/producto-variantes/AtributosSelector"
import { PrecioInput } from "@/pages/general/share/producto-variantes/PrecioInput"
import { SkuPreview } from "@/pages/general/share/producto-variantes/SkuPreview"

export default function CrearVarianteProducto() {
    const navigate = useNavigate();
    const [productos, setProductos] = useState<any[]>([])
    const [productoSeleccionado, setProductoSeleccionado] = useState<number | null>(null)

    const [atributos, setAtributos] = useState<any[]>([])
    const [valores, setValores] = useState<Record<number, any[]>>({})
    const [seleccionados, setSeleccionados] = useState<Record<number, string>>({})

    const [variantes, setVariantes] = useState<any[]>([])
    const [precio, setPrecio] = useState("")

    useEffect(() => {
        cargarProductos()
    }, [])

    async function cargarProductos() {
        try {
            const data = await productoVariantesService.obtenerProductos()
            setProductos(data || [])
        } catch (error) {
            console.error("Error al cargar productos:", error)
        }
    }

    async function seleccionarProducto(productoId: number) {
        setProductoSeleccionado(productoId)

        const variantesData = await productoVariantesService.listarVariantes(productoId)
        setVariantes(variantesData || [])

        const atributosProducto = await productoVariantesService.obtenerAtributos(productoId)
        setAtributos(atributosProducto || [])

        if (!atributosProducto || !atributosProducto.length) return

        const atributoIds = atributosProducto.map(a => a.id)
        const valoresMap = await productoVariantesService.obtenerValoresPorAtributos(atributoIds)
        setValores(valoresMap || {})
    }

    function seleccionarValor(atributoId: number, value: string) {
        setSeleccionados(prev => ({
            ...prev,
            [atributoId]: value
        }))
    }

    const skuGenerado = useMemo(() => {
        if (!atributos.length || !productoSeleccionado) return ""

        const producto = productos.find(p => p.id === productoSeleccionado)
        if (!producto) return ""

        const valoresSeleccionados = atributos.map(a => seleccionados[a.id])
        if (valoresSeleccionados.some(v => !v)) return ""

        const nombreProducto = producto.nombre.toUpperCase().replace(/\s+/g, "")
        const partes = valoresSeleccionados.map(v =>
            v.toUpperCase().replace(/\s+/g, "-")
        )

        return `${nombreProducto}-${partes.join("-")}`
    }, [seleccionados, atributos, productoSeleccionado, productos])

    async function crearVariante() {
        if (!productoSeleccionado) return

        const atributosInput = Object.entries(seleccionados).map(
            ([atributoId, valor]) => ({
                atributo_id: Number(atributoId),
                valor
            })
        )

        try {
            await productoVariantesService.crearVariante({
                producto_id: productoSeleccionado,
                sku: skuGenerado,
                precio_venta: precio ? Number(precio) : undefined,
                atributos: atributosInput
            })

            setPrecio("")
            setSeleccionados({})
            await seleccionarProducto(productoSeleccionado)

            navigate("/products?tab=lista");
        } catch (error) {
            console.error("Error al crear la variante:", error);
        }
    }

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                    <PackageSearch className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Crear Variante de Producto</h1>
                    <p className="text-muted-foreground text-sm">Selecciona un producto base y define sus especificaciones únicas.</p>
                </div>
            </div>

            <Separator />

            {/* Selector de Producto */}
            <ProductoSelector
                productoSeleccionado={productoSeleccionado}
                onSeleccionar={seleccionarProducto}
            />

            {/* Listado de variantes existentes si hay un producto seleccionado */}
            {productoSeleccionado !== null && variantes.length > 0 && (
                <div className="animate-in fade-in duration-500">
                    <VariantesExistentes variantes={variantes} />
                </div>
            )}

            {/* Configuración de la Nueva Variante */}
            {productoSeleccionado !== null && (
                <Card className="border-slate-200 shadow-md overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="bg-slate-50 border-b border-slate-100">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-600 uppercase tracking-wider">
                            <Settings2 className="h-4 w-4" />
                            Configuración de Nueva Variante
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-8">

                        <AtributosSelector
                            atributos={atributos}
                            valores={valores}
                            seleccionados={seleccionados}
                            onSeleccionar={seleccionarValor}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                            <div className="md:col-span-8">
                                {/* Aseguramos que SkuPreview no reciba basura */}
                                <SkuPreview sku={skuGenerado || ""} />
                            </div>

                            <div className="md:col-span-4">
                                <PrecioInput
                                    precio={precio}
                                    setPrecio={setPrecio}
                                />
                            </div>
                        </div>

                        <Separator />

                        <div className="flex justify-end">
                            <Button
                                onClick={crearVariante}
                                disabled={!skuGenerado}
                                size="lg"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-8"
                            >
                                <PlusCircle className="h-5 w-5" />
                                Crear Variante
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}