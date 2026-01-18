import { useState, useEffect } from "react";
import { Search, UserPlus, Check, Loader2, ChevronDown, User, Fingerprint } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ClienteService } from "@/services/clientes/cliente.service";
import type { ClienteEntity } from "@/types/clientes/entity/cliente.entity";

interface Props {
    onClienteSeleccionado: (cliente: ClienteEntity | null) => void;
}

export function ClienteSelector({ onClienteSeleccionado }: Props) {
    const [query, setQuery] = useState("");
    const [clientes, setClientes] = useState<ClienteEntity[]>([]);
    const [seleccionado, setSeleccionado] = useState<ClienteEntity | null>(null);
    const [modoRegistro, setModoRegistro] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menuAbierto, setMenuAbierto] = useState(false);

    const [nuevoCliente, setNuevoCliente] = useState({
        nombre: "",
        tipo_documento: "DNI" as "DNI" | "RUC",
        numero_documento: "",
    });

    // Carga inicial y búsqueda filtrada
    useEffect(() => {
        const obtenerClientes = async () => {
            setLoading(true);
            try {
                let data: ClienteEntity[];
                if (query.trim() === "") {
                    // Si no hay texto, trae los últimos 10 o todos (según tu Service)
                    data = await ClienteService.listarClientes();
                } else {
                    // Si hay texto, filtra
                    data = await ClienteService.buscarClientes(query);
                }
                setClientes(data);
            } catch (error) {
                console.error("Error cargando clientes:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(obtenerClientes, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSeleccionar = (c: ClienteEntity) => {
        setSeleccionado(c);
        setQuery(c.nombre);
        setMenuAbierto(false);
        onClienteSeleccionado(c);
    };

    const handleCrearCliente = async () => {
        if (!nuevoCliente.nombre || !nuevoCliente.numero_documento) {
            return alert("Por favor complete todos los campos");
        }
        setLoading(true);
        try {
            const clienteCreado = await ClienteService.registrarCliente(nuevoCliente);
            handleSeleccionar(clienteCreado);
            setModoRegistro(false);
            setNuevoCliente({ nombre: "", tipo_documento: "DNI", numero_documento: "" });
        } catch (error: any) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 w-full bg-transparent p-0">
            <div className="flex flex-col md:flex-row items-end gap-4">
                {!modoRegistro ? (
                    <div className="w-full md:w-1/2 relative">
                        <Label className="text-[10px] uppercase font-bold text-primary mb-1.5 block">
                            Buscar Cliente
                        </Label>
                        <div className="relative">
                            {loading ? (
                                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                            ) : (
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            )}
                            <Input
                                placeholder="Nombre o documento..."
                                value={query}
                                onFocus={() => setMenuAbierto(true)}
                                onChange={(e) => {
                                    setQuery(e.target.value);
                                    setMenuAbierto(true);
                                }}
                                className="pl-10 h-10 bg-white"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                        {menuAbierto && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setMenuAbierto(false)} />
                                <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg max-h-60 overflow-auto">
                                    {clientes.length > 0 ? (
                                        clientes.map((c) => (
                                            <div
                                                key={c.id}
                                                className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center border-b last:border-none transition-colors"
                                                onClick={() => handleSeleccionar(c)}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-700">{c.nombre}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase">{c.tipo_documento}: {c.numero_documento}</span>
                                                </div>
                                                {seleccionado?.id === c.id && <Check className="w-4 h-4 text-primary" />}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-400">No hay resultados</div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="w-full md:w-1/2">
                        <Label className="text-[10px] uppercase font-bold text-primary mb-1.5 block">Nuevo Registro</Label>
                        <div className="h-10 flex items-center px-3 bg-blue-50 text-primary rounded-md text-xs font-medium border border-blue-100">
                            Completando datos de cliente...
                        </div>
                    </div>
                )}

                <div className="pb-0.5">
                    <Button
                        size="sm"
                        onClick={() => {
                            setModoRegistro(!modoRegistro);
                            setSeleccionado(null);
                            onClienteSeleccionado(null);
                        }}
                        className={
                            modoRegistro
                                ? "h-10 px-4 text-primary opacity-100 hover:bg-primary/10 hover:text-primary cursor-pointer"
                                : "h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                        }
                        variant={modoRegistro ? "ghost" : "default"}
                    >
                        {modoRegistro ? (
                            "Volver a buscar"
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4 mr-2" />
                                Nuevo Cliente
                            </>
                        )}
                    </Button>
                </div>
            </div>
            {!modoRegistro ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-primary">
                            Nombre / Razón Social
                        </Label>
                        <div className="relative">
                            <User
                                className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-colors
                                    ${seleccionado
                                    ? "text-primary"
                                    : "text-slate-300"
                                    }`}
                                />
                            <Input
                                readOnly
                                value={seleccionado?.nombre || ""}
                                placeholder="No seleccionado"
                                className="pl-10 bg-white border-0 focus-visible:ring-0 shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold text-primary">
                            Documento de Identidad
                        </Label>
                        <div className="flex gap-2">
                            <div className="h-10 flex items-center gap-2 px-3 bg-white rounded-md shadow-sm font-mono">
                                {seleccionado ? (
                                    <>
                                    <span className="font-bold text-primary uppercase">
                                        {seleccionado.tipo_documento}:
                                    </span>
                                    <span className="text-slate-700">
                                        {seleccionado.numero_documento}
                                    </span>
                                    </>
                                ) : (
                                    <span className="text-slate-400">---</span>
                                )}
                                </div>

                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 rounded-xl bg-white shadow-sm">

                    <div className="md:col-span-6 space-y-1.5">
                        <Label className="text-xs font-bold">Nombre Completo</Label>
                        <Input
                            value={nuevoCliente.nombre}
                            onChange={e => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
                            className="bg-white"
                        />
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs font-bold">Tipo</Label>
                        <Select
                            value={nuevoCliente.tipo_documento}
                            onValueChange={v => setNuevoCliente({ ...nuevoCliente, tipo_documento: v as "DNI" | "RUC" })}
                        >
                            <SelectTrigger className="bg-white"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="DNI">DNI</SelectItem>
                                <SelectItem value="RUC">RUC</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="md:col-span-2 space-y-1.5">
                        <Label className="text-xs font-bold">Número</Label>
                        <Input
                            value={nuevoCliente.numero_documento}
                            onChange={e => setNuevoCliente({ ...nuevoCliente, numero_documento: e.target.value })}
                            className="bg-white"
                        />
                    </div>
                    <div className="md:col-span-2 flex items-end">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-10 px-4 text-slate-600 hover:bg-slate-100"
                        >
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

function Badge({ children, variant, className }: any) {
    return (
        <span className={`px-2 py-0.5 rounded-full font-medium ${className} ${variant === 'secondary' ? 'bg-secondary text-secondary-foreground' : ''}`}>
            {children}
        </span>
    );
}