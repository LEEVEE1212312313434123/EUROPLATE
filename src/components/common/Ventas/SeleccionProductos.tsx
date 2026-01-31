import { useState, useEffect, useRef } from "react";
import { Trash2, Search, Loader2, PackageSearch, Tag, Layers } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VentasInventarioService } from "@/services/ventas/venta.inventario.service";
import { CardHeader, CardTitle } from "@/components/ui/card";

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

    const CATEGORIAS = [
        "Materia Prima",
        "Productos Terminados",
        "Insumos de Producción",
        "Suministros Técnicos",
    ];

    const SUBCATEGORIAS: Record<string, string[]> = {
        "Materia Prima": [
            "Bobinas de cartón",
            "Bobinas de papel",
            "Papel en hojas",
            "Cartón kraft",
        ],
        "Productos Terminados": [
            "Cajas para paquetes",
            "Empaques personalizados",
            "Cajas corrugadas",
        ],
        "Insumos de Producción": [
            "Placas de impresión",
            "Tintas",
            "Barnices",
        ],
        "Suministros Técnicos": [
            "Repuestos de máquina",
            "Rodillos",
            "Lubricantes",
        ],
    };
    const selectBase = "h-10 min-w-[190px] max-w-[230px] bg-white border border-primary/30 text-[11px] font-semibold text-primary focus:ring-2 focus:ring-primary/30 transition-all";
    const [categoria, setCategoria] = useState<string | null>(null);
    const [subcategoria, setSubcategoria] = useState<string | null>(null);
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

    const resultadosFiltrados = catalogo
        .filter(p => {
            if (categoria && p.categoria !== categoria) return false;
            if (subcategoria && p.subcategoria !== subcategoria) return false;
            if (
                searchTerm.trim() &&
                !p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            ) return false;
            return true;
        })
        .slice(0, 15);

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
            <CardHeader className="px-0 pb-4">
                <CardTitle className="text-sm flex items-center gap-2 uppercase text-primary font-bold">
                    <PackageSearch className="w-4 h-4" />
                    Selección de Artículos
                </CardTitle>
            </CardHeader>

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
                <div className="xl:col-span-6 flex flex-wrap gap-3 justify-end">
                    <div className="space-y-1">
                        <Select
                            value={categoria ?? ""}
                            onValueChange={(value) => {
                                setCategoria(value);
                                setSubcategoria(null);
                            }}
                        >
                            <SelectTrigger className={selectBase}>
                                <div className="flex items-center gap-2 truncate">
                                    <Tag className="w-3 h-3 text-primary shrink-0" />
                                    <SelectValue
                                        placeholder="Categoría"
                                        className="text-primary/60"
                                    />
                                </div>
                            </SelectTrigger>

                            <SelectContent className="border border-primary/20">
                                {CATEGORIAS.map(cat => (
                                    <SelectItem
                                        key={cat}
                                        value={cat}
                                        className="text-[11px] font-medium text-slate-700 focus:bg-primary/10 focus:text-primary"
                                    >
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Select
                            value={subcategoria ?? ""}
                            onValueChange={setSubcategoria}
                            disabled={!categoria}
                        >
                            <SelectTrigger className={selectBase}>
                                <div className="flex items-center gap-2 truncate">
                                    <Layers className="w-3 h-3 text-primary shrink-0" />
                                    <SelectValue
                                        placeholder="Subcategoría"
                                        className="text-primary/60"
                                    />
                                </div>
                            </SelectTrigger>

                            <SelectContent className="border border-primary/20">
                                {categoria &&
                                    SUBCATEGORIAS[categoria].map(sub => (
                                        <SelectItem
                                            key={sub}
                                            value={sub}
                                            className="text-[11px] font-medium text-slate-700 focus:bg-primary/10 focus:text-primary"
                                        >
                                            {sub}
                                        </SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
            <div className="rounded-xl border border-none bg-white overflow-hidden shadow-none">
                <Table>
                    <TableHeader className="">
                        <TableRow className="hover:bg-transparent border-b border-slate-100">
                            <TableHead className="w-30 text-[11px] uppercase font-bold text-primary">ID PRODUCTO</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-primary">Producto</TableHead>
                            <TableHead className="w-32 text-center text-[11px] uppercase font-bold text-primary">Cantidad</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-primary">P. Unitario</TableHead>
                            <TableHead className="text-[11px] uppercase font-bold text-primary">Total</TableHead>
                            <TableHead className="w-16 text-center text-[11px] uppercase font-bold text-primary">Acción</TableHead>
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
                                    <TableCell className="text-[10px] font-mono font-bold text-primary">
                                        #{item.id.toString().substring(0, 6)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-semibold text-black text-sm">{item.nombre}</div>
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
                                    <TableCell className="text-sm font-medium text-black">
                                        {item.moneda} {item.precio.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="text-sm font-bold text-primary">
                                        {item.moneda} {(item.cantidad * item.precio).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-center">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeProducto(item.id)}
                                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10 transition-all cursor-pointer"
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