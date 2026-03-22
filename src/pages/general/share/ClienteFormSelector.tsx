"use client"

import { useState } from "react"
import { UserPlus, Users, Loader2, Save, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClienteSelector } from "@/pages/general/share/selectors/ClienteSelector"
import { clienteService } from "@/services/general/shared/cliente.service"

type Props = {
    clienteId: number | null
    onChange: (id: number | null) => void
}

export default function ClienteFormSelector({
    clienteId,
    onChange
}: Props) {
    const [modoNuevo, setModoNuevo] = useState(false)
    const [loading, setLoading] = useState(false)
    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        telefono: "",
        email: "",
        direccion: ""
    })

    async function crearCliente() {
        if (!nuevoCliente.nombre) {
            // Aquí podrías usar un toast si lo tuvieras instalado
            return
        }

        try {
            setLoading(true)
            const cliente = await clienteService.registrarCliente(nuevoCliente)

            onChange(cliente.id)
            setModoNuevo(false)
            setNuevoCliente({
                nombre: "",
                telefono: "",
                email: "",
                direccion: ""
            })
        } catch (error: any) {
            console.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
            <CardHeader className="py-3 px-4 bg-muted/10 border-b">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                        {modoNuevo ? <UserPlus className="h-4 w-4 text-primary" /> : <Users className="h-4 w-4 text-primary" />}
                        Cliente
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        onClick={() => setModoNuevo(!modoNuevo)}
                    >
                        {modoNuevo ? (
                            <> <X className="h-3 w-3 mr-1" /> Cancelar </>
                        ) : (
                            <> <UserPlus className="h-3 w-3 mr-1" /> Nuevo </>
                        )}
                    </Button>
                </div>
            </CardHeader>

            <CardContent className="p-4 bg-white">
                {/* SELECTOR CLIENTE EXISTENTE */}
                {!modoNuevo && (
                    <div className="space-y-1">
                        <Label className="text-[11px] uppercase tracking-wider text-muted-foreground font-bold">
                            Buscar Cliente
                        </Label>
                        <ClienteSelector
                            clienteSeleccionado={clienteId}
                            onSeleccionar={(id) => onChange(id)}
                        />
                    </div>
                )}

                {/* FORMULARIO NUEVO CLIENTE */}
                {modoNuevo && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="nombre" className="text-xs">Nombre Completo *</Label>
                                <Input
                                    id="nombre"
                                    placeholder="Ej. Juan Pérez"
                                    className="h-9 text-sm"
                                    value={nuevoCliente.nombre}
                                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="telefono" className="text-xs">Teléfono</Label>
                                <Input
                                    id="telefono"
                                    placeholder="999..."
                                    className="h-9 text-sm"
                                    value={nuevoCliente.telefono}
                                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-xs">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    className="h-9 text-sm"
                                    value={nuevoCliente.email}
                                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
                                />
                            </div>

                            <div className="col-span-2 space-y-1.5">
                                <Label htmlFor="direccion" className="text-xs">Dirección</Label>
                                <Input
                                    id="direccion"
                                    placeholder="Av. Las Flores 123..."
                                    className="h-9 text-sm"
                                    value={nuevoCliente.direccion}
                                    onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
                                />
                            </div>
                        </div>

                        <Separator />

                        <Button
                            onClick={crearCliente}
                            disabled={loading || !nuevoCliente.nombre}
                            className="w-full h-10 font-bold bg-green-600 hover:bg-green-700 shadow-md transition-all active:scale-95"
                        >
                            {loading ? (
                                <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando... </>
                            ) : (
                                <> <Save className="mr-2 h-4 w-4" /> Guardar y Seleccionar </>
                            )}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}