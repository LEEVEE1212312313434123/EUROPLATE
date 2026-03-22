"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Ship, Container, DollarSign, Calendar } from "lucide-react"

export default function CompraImportacionForm({ importacion, setImportacion }: any) {

    const handleChange = (campo: string, valor: any) => {
        setImportacion({
            ...importacion,
            [campo]: valor
        })
    }

    return (
        <Card className="shadow-sm border-indigo-100">
            <CardHeader className="bg-slate-50/50 pb-4">
                <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
                    <Ship className="h-5 w-5 text-indigo-600" />
                    Detalles de Importación
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">

                {/* SECCIÓN 1: LOGÍSTICA */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-600">
                        <Container className="h-4 w-4" /> Logística y Transporte
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Incoterm</Label>
                            <Input
                                placeholder="Ej: FOB, CIF..."
                                value={importacion.incoterm || ""}
                                onChange={(e) => handleChange("incoterm", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Puerto Origen</Label>
                            <Input
                                placeholder="Puerto de salida"
                                value={importacion.puerto_origen || ""}
                                onChange={(e) => handleChange("puerto_origen", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Puerto Destino</Label>
                            <Input
                                placeholder="Puerto de llegada"
                                value={importacion.puerto_destino || ""}
                                onChange={(e) => handleChange("puerto_destino", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>N° Contenedor</Label>
                            <Input
                                placeholder="Código de contenedor"
                                value={importacion.numero_contenedor || ""}
                                onChange={(e) => handleChange("numero_contenedor", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label>Agente de Aduanas</Label>
                            <Input
                                placeholder="Nombre del agente o agencia"
                                value={importacion.agente_aduanas || ""}
                                onChange={(e) => handleChange("agente_aduanas", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* SECCIÓN 2: TIEMPOS */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-600">
                        <Calendar className="h-4 w-4" /> Fechas Estimadas
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha Embarque</Label>
                            <Input
                                type="date"
                                value={importacion.fecha_embarque || ""}
                                onChange={(e) => handleChange("fecha_embarque", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Fecha Llegada (ETA)</Label>
                            <Input
                                type="date"
                                value={importacion.fecha_llegada || ""}
                                onChange={(e) => handleChange("fecha_llegada", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* SECCIÓN 3: COSTOS ADICIONALES */}
                <div className="space-y-4">
                    <h3 className="text-sm font-semibold flex items-center gap-2 text-slate-600">
                        <DollarSign className="h-4 w-4" /> Gastos de Importación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Costo Flete</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={importacion.costo_flete || ""}
                                onChange={(e) => handleChange("costo_flete", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Costo Seguro</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={importacion.costo_seguro || ""}
                                onChange={(e) => handleChange("costo_seguro", e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Costo Aduana / Arancel</Label>
                            <Input
                                type="number"
                                placeholder="0.00"
                                value={importacion.costo_aduana || ""}
                                onChange={(e) => handleChange("costo_aduana", e.target.value)}
                            />
                        </div>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}