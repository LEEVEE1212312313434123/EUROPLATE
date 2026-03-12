"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { comprasService } from "@/services/general/compras.service"
import CompraForm from "@/pages/general/share/compras/CompraForm"
import CompraImportacionForm from "@/pages/general/share/compras/CompraImportacionForm"
import CompraDetallesTable from "@/pages/general/share/compras/CompraDetallesTable"
import CompraDocumentosForm from "@/pages/general/share/compras/CompraDocumentosForm"
import { toast } from "sonner"
import { Loader2, ShoppingCart } from "lucide-react"
import { useMoneda } from "@/pages/general/share/hooks/moneda.hook"

export default function CrearCompra() {

    const { tipoCambio } = useMoneda()

    const [loading, setLoading] = useState(false)

    const [tipoCompra, setTipoCompra] = useState("NACIONAL")

    const [proveedorId, setProveedorId] = useState<number | null>(null)

    const [fecha, setFecha] = useState(
        new Date().toISOString().split("T")[0]
    )

    const [detalles, setDetalles] = useState<any[]>([])

    const [documentos, setDocumentos] = useState<any[]>([])

    const [importacion, setImportacion] = useState({

        incoterm: "",
        puerto_origen: "",
        puerto_destino: "",

        numero_contenedor: "",
        agente_aduanas: "",

        fecha_embarque: "",
        fecha_llegada: "",

        costo_flete: 0,
        costo_seguro: 0,
        costo_aduana: 0
    })


    const calcularTotal = () => {

        return detalles.reduce((acc, item) => {

            const cantidad = Number(item.cantidad) || 0
            const precio = Number(item.precio || item.precio_unitario) || 0

            return acc + (cantidad * precio)

        }, 0)

    }


    const validarFormulario = () => {

        if (!proveedorId) {

            toast.warning("Seleccione un proveedor")
            return false

        }

        if (!fecha) {

            toast.warning("La fecha es obligatoria")
            return false

        }

        if (tipoCompra === "IMPORTACION") {

            if (!tipoCambio) {

                toast.warning("No hay tipo de cambio registrado")
                return false

            }

            if (!importacion.incoterm.trim()) {

                toast.warning("Ingrese el Incoterm")
                return false

            }

            if (!importacion.puerto_origen.trim()) {

                toast.warning("Ingrese puerto de origen")
                return false

            }

            if (!importacion.puerto_destino.trim()) {

                toast.warning("Ingrese puerto de destino")
                return false

            }

        }

        if (detalles.length === 0) {

            toast.warning("Debe agregar al menos un producto")
            return false

        }

        for (const [index, item] of detalles.entries()) {

            const numProducto = index + 1

            if (!item.variante_id && !item.id) {

                toast.warning(`Producto #${numProducto}: No tiene producto`)
                return false

            }

            if (!item.almacen_id) {

                toast.warning(`Producto #${numProducto}: Seleccione un almacén`)
                return false

            }

            if (!item.cantidad || Number(item.cantidad) <= 0) {

                toast.warning(`Producto #${numProducto}: Cantidad inválida`)
                return false

            }

            if (!item.precio && !item.precio_unitario) {

                toast.warning(`Producto #${numProducto}: Ingrese el precio`)
                return false

            }

        }

        return true

    }


    const guardarCompra = async () => {

        if (!validarFormulario()) return

        try {

            setLoading(true)

            const totalOriginal = calcularTotal()

            let totalSoles = totalOriginal

            // Si es importación convertir a soles
            if (tipoCompra === "IMPORTACION") {

                totalSoles = totalOriginal * (tipoCambio || 1)

            }

            const detallesFormateados = detalles.map(item => {

                const precio = Number(item.precio || item.precio_unitario)

                const precioBase =
                    tipoCompra === "IMPORTACION"
                        ? precio * (tipoCambio || 1)
                        : precio

                return {

                    variante_id: item.variante_id || item.id,

                    cantidad: Number(item.cantidad),

                    precio: precio,

                    precio_base: precioBase,

                    moneda_id: tipoCompra === "IMPORTACION" ? 2 : 1,

                    almacen_id: item.almacen_id

                }

            })


            await comprasService.registrarCompra({

                compra: {

                    proveedor_id: Number(proveedorId),

                    tipo_compra: tipoCompra,

                    fecha: fecha,

                    total: totalSoles,

                    moneda_id: tipoCompra === "IMPORTACION" ? 2 : 1,

                    tipo_cambio: tipoCompra === "IMPORTACION"
                        ? tipoCambio
                        : 1

                },

                detalles: detallesFormateados,

                importacion:

                    tipoCompra === "IMPORTACION"
                        ? importacion
                        : null,

                documentos: documentos.map(doc => ({

                    nombre_archivo:
                        doc.nombre_archivo || doc.name,

                    tipo_documento:
                        doc.tipo_documento || "ADJUNTO"

                }))

            })


            toast.success("¡Compra registrada exitosamente!")

            setDetalles([])
            setDocumentos([])
            setProveedorId(null)

        } catch (error: any) {

            console.error("Error al registrar:", error)

            toast.error(
                error.message ||
                "Error al procesar la compra"
            )

        } finally {

            setLoading(false)

        }

    }


    return (

        <div className="p-6 max-w-6xl mx-auto">

            <Card className="shadow-xl border-slate-200">

                <CardHeader className="bg-slate-50/50 border-b">

                    <div className="flex items-center gap-3">

                        <div className="p-2 bg-blue-600 rounded-lg shadow-inner">

                            <ShoppingCart className="w-6 h-6 text-white" />

                        </div>

                        <div>

                            <CardTitle className="text-2xl font-black text-slate-800 tracking-tight">

                                Gestión de Compras

                            </CardTitle>

                            <p className="text-slate-500 text-sm font-medium italic">

                                Registro de mercadería y control de inventario

                            </p>

                        </div>

                    </div>

                </CardHeader>

                <CardContent className="p-6 space-y-8">

                    <CompraForm
                        tipoCompra={tipoCompra}
                        setTipoCompra={setTipoCompra}
                        proveedorId={proveedorId}
                        setProveedorId={setProveedorId}
                        fecha={fecha}
                        setFecha={setFecha}
                    />

                    {tipoCompra === "IMPORTACION" && (

                        <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl">

                            <h3 className="text-xs font-bold text-amber-700 uppercase mb-4 tracking-widest">

                                Datos de Aduana e Importación

                            </h3>

                            <CompraImportacionForm
                                importacion={importacion}
                                setImportacion={setImportacion}
                            />

                        </div>

                    )}

                    <div className="space-y-4">

                        <div className="flex items-center justify-between">

                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">

                                Items del Documento

                            </h3>

                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">

                                Total items: {detalles.length}

                            </span>

                        </div>

                        <CompraDetallesTable
                            detalles={detalles}
                            setDetalles={setDetalles}
                        />

                    </div>

                    <div className="space-y-4">

                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">

                            Sustentos y Adjuntos

                        </h3>

                        <CompraDocumentosForm
                            documentos={documentos}
                            setDocumentos={setDocumentos}
                        />

                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-100">

                        <Button
                            size="lg"
                            className="w-full md:w-72 h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700"
                            onClick={guardarCompra}
                            disabled={loading}
                        >

                            {loading ? (

                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Procesando...
                                </>

                            ) : (

                                "Confirmar y Registrar"

                            )}

                        </Button>

                    </div>

                </CardContent>

            </Card>

        </div>

    )

}