import { useState, useEffect, useMemo } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { Product } from "@/types/product.types";

// ⚠️ Se actualiza ProductoBase para incluir el ID y todos los metadatos necesarios
// que deben arrastrarse al paso 2 (Precios).
export interface ProductoBase {
    // 🔑 CAMPOS DE METADATOS CLAVE (Originales del producto)
    id?: string | number; // Necesario para la actualización final
    categoria?: string;
    nombre_producto?: string;
    estado?: string;
    accion?: string;
    fecha_registro?: string;
    imagen?: string;
    moneda?: string;

    // CAMPOS DE ALMACEN Y PRECIO (Necesarios para el mapeo final, no editables aquí)
    stock_actual?: string | number;
    stock_minimo?: string | number;
    ubicacion?: string;
    precioMin?: string | number; // Incluimos campos de precio si existen en el producto original (útil para inicializar step 2)
    precioMax?: string | number;
    peso_kg?: string | number; // <-- Campo clave que se debe arrastrar

    // CAMPOS EDITABLES (Material/Grade)
    [key: string]: string | number | boolean | undefined;
    grade?: string;
    tipo?: string;
    ancho?: string;
    largo?: string;
    gramaje?: string;
    calibre?: string;
    pliegos?: string;
    unidad?: string;
}

// Interfaz de propiedades del componente
interface ProductosEditarFormProps {
    producto: Product; // Producto que vamos a editar
    navigate: any;
    // La función onNext espera un solo objeto ProductoBase
    onNext: (productoEditado: ProductoBase) => void;
}

// Definición de todas las posibles columnas con sus tipos (Define el ORDEN correcto)
const ALL_COLUMNS = [
    { key: "grade", label: "Descripción", type: "text" },
    { key: "tipo", label: "Tipo", type: "text" },
    { key: "ancho", label: "Ancho (cm)", type: "number" },
    { key: "largo", label: "Largo (cm)", type: "number" },
    { key: "gramaje", label: "Gramaje (g)", type: "number" },
    { key: "calibre", label: "Calibre", type: "number" },
    { key: "pliegos", label: "Pliegos x Paquete", type: "number" },
    { key: "unidad", label: "Unidad medida", type: "select" },
];

// Función auxiliar para determinar las clases de ancho de la columna
const getColumnWidthClass = (key: string) => {
    // El campo 'grade' (Descripción) necesita un poco más de espacio
    if (key === "grade") {
        return "w-[180px] min-w-[180px]"; // Ancho fijo y mínimo para que no se comprima demasiado
    }
    // Todos los demás campos son compactos y de 120px
    return "w-[120px] min-w-[120px]";
};


const ProductosEditarForm = ({ producto, navigate, onNext }: ProductosEditarFormProps) => {
    // ⚠️ Se usa un solo estado de objeto en lugar de un array, ya que es una sola fila
    const [productoEditado, setProductoEditado] = useState<ProductoBase>({});

    // Bandera para determinar si es un producto de tipo 'Bobinas de Cartón'
    const esBobinasCarton = producto.categoria === "BobinasCarton";

    // Lógica para determinar las columnas visibles
    const columnasVisibles = useMemo(() => {
        if (esBobinasCarton) {
            // Bobinas de Cartón: solo muestran campos específicos, manteniendo el orden de ALL_COLUMNS
            return ALL_COLUMNS.filter(c =>
                ["grade", "tipo", "ancho", "gramaje", "unidad"].includes(c.key)
            );
        }

        // Otros productos: Muestran todas las columnas relevantes, manteniendo el orden de ALL_COLUMNS
        return ALL_COLUMNS.filter(c =>
            ["tipo", "ancho", "largo", "gramaje", "calibre", "pliegos", "unidad"].includes(c.key)
        );
    }, [esBobinasCarton]);

    // Inicialización del estado con el producto existente
    useEffect(() => {
        // 1. Extracción de todos los campos, incluyendo los que no son editables en este paso
        const productoInicial: ProductoBase = {
            // 🔑 CAMPOS DE METADATOS CLAVE (Transferencia de ID asegurada)
            id: producto.id, // 🔑 ID asegurado
            categoria: producto.categoria,
            nombre_producto: producto.nombre_producto,
            estado: producto.estado,
            accion: producto.accion,
            fecha_registro: producto.fecha_registro,
            imagen: producto.imagen,
            moneda: producto.precio?.moneda,

            // CAMPOS DE ALMACÉN Y PRECIO (Necesarios para el mapeo final en el paso 2)
            stock_actual: String(producto.almacen?.stock_actual || ""),
            stock_minimo: String(producto.almacen?.stock_minimo || ""),
            ubicacion: producto.almacen?.ubicacion,
            precioMin: String(producto.precio?.precio_min || ""),
            precioMax: String(producto.precio?.precio_max || ""),
            // ✅ CORRECCIÓN CLAVE: Mapear el peso_kg anidado a la propiedad plana peso_kg
            peso_kg: String(producto.material?.peso_kg || ""),

            // CAMPOS EDITABLES (Material/Grade)
            grade: producto.grade ?? "",
            tipo: producto.material?.tipo ?? "",
            ancho: String(producto.material?.dimensiones?.ancho_cm || ""),
            largo: String(producto.material?.dimensiones?.largo_cm || ""),
            gramaje: String(producto.material?.gramaje_g || ""),
            calibre: String(producto.material?.calibre || ""),
            pliegos: String(producto.material?.pliegos_por_paquete || ""),
            unidad: producto.material?.unidad_medida ?? "",
        };

        // 2. Inicializar el estado con todos los campos necesarios.
        // Se copia 'productoInicial' directamente para asegurar que todos los metadatos
        // (incluyendo el ID) se arrastren al siguiente paso.
        setProductoEditado(productoInicial);
    }, [producto]);

    const handleChange = (campo: string, valor: string) => {
        setProductoEditado((prev) => ({ ...prev, [campo]: valor }));
    };

    // Lógica de validación: todos los campos visibles deben estar llenos y ser válidos (si son numéricos)
    const validar = (): boolean => {
        return columnasVisibles.every((col) => {
            const valor = String(productoEditado[col.key] ?? "").trim();

            // Si el valor está vacío, es inválido
            if (valor === "") return false;

            // Para campos numéricos, validar que sea un número positivo o cero
            if (col.type === "number") {
                const num = Number(valor);
                return !isNaN(num) && num >= 0;
            }

            // Para otros campos (texto/select)
            return true;
        });
    };

    const guardar = () => {
        if (!validar()) {
            return toast.error("Completa todos los campos válidamente antes de guardar.");
        }

        // Se llama a onNext con el único producto editado (que ahora incluye el ID y peso_kg)
        onNext(productoEditado);
    };

    // Renderizado condicional de la celda (Input/Select)
    const renderCell = (c: (typeof ALL_COLUMNS)[number]) => {
        if (c.key === "unidad") {
            return (
                <Select
                    value={productoEditado.unidad as string}
                    onValueChange={(v) => handleChange(c.key, v)}
                >
                    {/* Añadimos w-full para que el select ocupe el ancho de la celda */}
                    <SelectTrigger className="h-7 text-sm w-full">
                        <SelectValue placeholder="Unidad" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Unidad">Unidad</SelectItem>
                        <SelectItem value="Paquete">Paquete</SelectItem>
                        <SelectItem value="Docena">Docena</SelectItem>
                    </SelectContent>
                </Select>
            );
        }

        const inputType = c.type === "number" ? "number" : "text";

        return (
            <Input
                type={inputType}
                value={String(productoEditado[c.key] ?? "")}
                onChange={(e) => handleChange(c.key, e.target.value)}
                // Añadimos w-full para que el input ocupe el ancho de la celda
                className="h-7 text-sm w-full"
                min={inputType === "number" ? "0" : undefined}
            />
        );
    };

    return (
        <>
            {/* SOLUCIÓN DE RESPONSIVIDAD: Se envuelve la tabla en un div con overflow-x-auto 
            para permitir el desplazamiento horizontal y evitar que el contenido se esconda al achicar la ventana.
            */}
            <div className="overflow-x-auto w-full">
                <Table className="text-sm border-collapse">
                    <TableHeader>
                        <TableRow>
                            {columnasVisibles.map((c) => (
                                <TableHead
                                    key={c.key}
                                    // Aplicamos la clase de ancho fijo al encabezado
                                    className={getColumnWidthClass(c.key)}
                                >
                                    {/* Ajuste de label para BobinasCarton */}
                                    {c.key === 'ancho' && esBobinasCarton ? "Ancho (mm)" : c.label}
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Solo una fila para el producto que se está editando */}
                        <TableRow>
                            {columnasVisibles.map((c) => (
                                <TableCell
                                    key={c.key}
                                    // Aplicamos la clase de ancho fijo a la celda
                                    className={getColumnWidthClass(c.key)}
                                >
                                    {renderCell(c)}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div className="fixed bottom-6 right-6 flex gap-2">
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(-1)}
                >
                    Cancelar
                </Button>
                <Button
                    className="cursor-pointer"
                    size="sm"
                    onClick={guardar}
                    disabled={!validar()}
                >
                    Continuar
                </Button>
            </div>
        </>
    );
};

export default ProductosEditarForm;