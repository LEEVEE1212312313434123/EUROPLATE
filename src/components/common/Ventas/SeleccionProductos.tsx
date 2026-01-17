import { useState, useEffect, useRef } from "react";
import { Trash2, Search, Loader2, PackageSearch, Tag, Layers, Box } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VentasInventarioService } from "@/services/ventas/venta.inventario.service";

interface Props {
    productosSeleccionados: any[];
    setProductosSeleccionados: React.Dispatch<React.SetStateAction<any[]>>;
}

export function SeleccionProductos({ productosSeleccionados, setProductosSeleccionados }: Props) {
    const [catalogo, setCatalogo] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showResults, setShowResults] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function cargarInventario() {
            try {
                setLoading(true);
                const data = await VentasInventarioService.getCatalogoVenta();
                setCatalogo(data || []);
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        }
        cargarInventario();

        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const resultadosFiltrados = searchTerm.trim() === ""
        ? catalogo.slice(0, 15)
        : catalogo.filter(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    const addProducto = (p: any) => {
        if (productosSeleccionados.some(item => item.id === p.id)) return;
        const nuevoItem = {
            id: p.id,
            nombre: p.nombre,
            cantidad: 1,
            precio: p.precio,
            moneda: p.moneda,
            stock: p.stock
        };
        setProductosSeleccionados([...productosSeleccionados, nuevoItem]);
        setSearchTerm("");
        setShowResults(false);
    };

    const updateCantidad = (id: number, cant: number) => {
        setProductosSeleccionados(prev => prev.map(p =>
            p.id === id ? { ...p, cantidad: Math.max(1, cant) } : p
        ));
    };

    const removeProducto = (id: number) => {
        setProductosSeleccionados(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="space-y-6" ref={containerRef}>
            {/* 1. TÍTULO DE SECCIÓN */}
            <div className="flex items-center gap-2 mb-2">
                <PackageSearch className="w-5 h-5 text-slate-400" />
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Selección de Artículos</h2>
            </div>

            {/* 2. BARRA DE BÚSQUEDA Y SELECTS DE ADORNO */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-end">
                {/* Buscador (Izquierda) */}
                <div className="xl:col-span-6 relative">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Escriba el nombre del producto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setShowResults(true)}
                            className="pl-10 h-10 bg-white shadow-sm focus-visible:ring-blue-500 transition-all"
                        />
                        {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 text-blue-500" />}
                    </div>

                    {/* Resultados de búsqueda */}
                    {showResults && !loading && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                            {resultadosFiltrados.length > 0 ? (
                                resultadosFiltrados.map((p) => (
                                    <div
                                        key={p.id}
                                        onClick={() => addProducto(p)}
                                        className="flex items-center justify-between p-3.5 hover:bg-blue-50 cursor-pointer border-b border-slate-50 last:border-0 transition-colors"
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-slate-700 text-sm">{p.nombre}</span>
                                            <span className="text-[10px] font-mono text-slate-400">SKU: {p.id.toString().padStart(5, '0')}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-black text-blue-600 text-sm">{p.moneda} {p.precio.toFixed(2)}</div>
                                            <div className={`text-[10px] font-bold ${p.stock < 10 ? 'text-orange-500' : 'text-slate-400'}`}>
                                                Stock: {p.stock}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-center text-slate-400 text-xs italic">No se encontraron productos</div>
                            )}
                        </div>
                    )}
                </div>

                {/* Selects Decorativos (Derecha) */}
                <div className="xl:col-span-6 grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                        <Select disabled defaultValue="cat">
                            <SelectTrigger className="h-10 bg-slate-50 border-none text-[11px] font-medium text-slate-500">
                                <div className="flex items-center gap-2"><Tag className="w-3 h-3" /><SelectValue /></div>
                            </SelectTrigger>
                            <SelectContent><SelectItem value="cat">Categoría</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Select disabled defaultValue="sub">
                            <SelectTrigger className="h-10 bg-slate-50 border-none text-[11px] font-medium text-slate-500">
                                <div className="flex items-center gap-2"><Layers className="w-3 h-3" /><SelectValue /></div>
                            </SelectTrigger>
                            <SelectContent><SelectItem value="sub">Subcategoría</SelectItem></SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Select disabled defaultValue="prod">
                            <SelectTrigger className="h-10 bg-slate-50 border-none text-[11px] font-medium text-slate-500">
                                <div className="flex items-center gap-2"><Box className="w-3 h-3" /><SelectValue /></div>
                            </SelectTrigger>
                            <SelectContent><SelectItem value="prod">Producto</SelectItem></SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* 3. TABLA DE PRODUCTOS */}
            <div className="rounded-xl border border-none bg-white overflow-hidden shadow-none">
                <Table>
                    <TableHeader className="">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                            <TableHead className="w-30 text-[11px] uppercase font-bold text-slate-400">ID PRODUCTO</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-slate-400">Producto</TableHead>
                            <TableHead className="w-32 text-center text-[11px] uppercase font-bold text-slate-400">Cantidad</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-slate-400">P. Unitario</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-slate-400">Total</TableHead>
                            <TableHead className="w-16 text-center text-[11px] uppercase font-bold text-slate-400">Acción</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productosSeleccionados.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-slate-400 text-sm">
                                    <div className="flex flex-col items-center gap-2 opacity-50">
                                        <PackageSearch className="w-8 h-8" />
                                        <p className="italic font-medium">No hay productos en el carrito</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            productosSeleccionados.map((item) => (
                                <TableRow key={item.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                                    <TableCell className="text-[10px] font-mono font-bold text-slate-400">
                                        #{item.id.toString().substring(0, 6)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-slate-700 text-sm">{item.nombre}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Input
                                                type="number"
                                                value={item.cantidad}
                                                onChange={(e) => updateCantidad(item.id, parseInt(e.target.value) || 0)}
                                                className="h-8 w-20 text-center font-bold bg-white border-slate-200"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm font-medium text-slate-600">
                                        {item.moneda} {item.precio.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-sm font-black text-blue-600">
                                        {item.moneda} {(item.cantidad * item.precio).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProducto(item.id)}
                                                className="h-8 w-8 text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}