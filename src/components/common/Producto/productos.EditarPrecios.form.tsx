import { useState, useEffect } from "react";
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
import { toast } from "sonner";
// Importamos el tipo ProductoBase (asumido exportado en el archivo de edición/agregar)
import type { ProductoBase } from "@/components/common/Producto/productos.EditarAgregar.form";

// ⚠️ Se importa el servicio y el tipo Product para la actualización real
import { ProductService } from "@/services/products.service";
import type { Product } from "@/types/product.types";

// Definición de las propiedades esperadas
interface ProductosEditarPreciosFormProps {
    categoria: string;
    // productsPrevios contiene el único ProductoBase editado del paso 1, más cualquier campo de precio
    // Asumimos que también contiene los campos originales del producto, incluyendo 'id', 'nombre_producto', etc.
    productosPrevios: ProductoBase[];
    navigate: any;
}

// ⚠️ REMOVIDO: Se elimina mockUpdateProduct ya que usaremos ProductService.update

export default function ProductosEditarPreciosForm({
    categoria,
    productosPrevios,
    navigate
}: ProductosEditarPreciosFormProps) {
    // Inicializamos con el producto (o productos, aunque en este flujo será solo uno)
    const [productos, setProductos] = useState<ProductoBase[]>(() => {
        // Aseguramos que el producto tenga los campos de precio para editar
        return productosPrevios.map(p => ({
            ...p,
            precioMin: p.precioMin ?? "",
            precioMax: p.precioMax ?? "",
            // El campo 'peso' no se editó en el paso 1, pero se puede añadir aquí
            peso: p.peso_kg ?? "",
        }));
    });

    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (index: number, field: string, value: string) => {
        setProductos((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
        );
    };

    const validar = (): boolean => {
        return productos.every(
            (p) =>
                // Validamos que los campos de peso y precio no estén vacíos y sean números válidos
                (p.peso && !isNaN(Number(p.peso)) && Number(p.peso) >= 0) &&
                (p.precioMin && !isNaN(Number(p.precioMin)) && Number(p.precioMin) >= 0) &&
                (p.precioMax && !isNaN(Number(p.precioMax)) && Number(p.precioMax) >= 0)
        );
    };

    const guardar = async () => {
        if (isSaving) return;
        setIsSaving(true);

        if (!validar()) {
            toast.error("Completa todos los campos (Peso, Precio Mínimo y Precio Máximo) válidamente.");
            setIsSaving(false);
            return;
        }

        const productoActualizado = productos[0]; // Solo hay un producto

        // ⚠️ LÓGICA DE MAPEO DE PRODUCTOBASE A PRODUCT (Estructura anidada)
        try {
            // 1. Extraer el ID
            const productoId = Number(productoActualizado.id);

            console.log("productoActualizado:", productoActualizado);
            console.log("primer producto de productos:", productos[0]);

            if (isNaN(productoId) || productoId <= 0) {
                throw new Error("ID de producto inválido para la actualización.");
            }

            // 2. Mapear los campos planos de ProductoBase a la estructura anidada de Product
            const productoMapeado: Product = {
                // Campos principales (asumimos que vienen del producto original)
                id: productoId,
                nombre_producto: String(productoActualizado.nombre_producto ?? ""),
                categoria: String(productoActualizado.categoria ?? categoria),
                estado: String(productoActualizado.estado ?? "Activo"),
                accion: String(productoActualizado.accion ?? "Editar"),
                fecha_registro: String(productoActualizado.fecha_registro ?? new Date().toISOString()),
                imagen: String(productoActualizado.imagen ?? ""),
                tipo: String(productoActualizado.tipo ?? ""),
                grade: String(productoActualizado.grade ?? ""),

                // Material (editado en el paso 1 y peso aquí)
                material: {
                    tipo: String(productoActualizado.tipo ?? ""),
                    dimensiones: {
                        ancho_cm: Number(productoActualizado.ancho) || 0,
                        largo_cm: Number(productoActualizado.largo) || 0,
                    },
                    gramaje_g: Number(productoActualizado.gramaje) || 0,
                    calibre: Number(productoActualizado.calibre) || 0,
                    pliegos_por_paquete: Number(productoActualizado.pliegos) || 0,
                    unidad_medida: String(productoActualizado.unidad ?? "Unidad"),
                    // ⚠️ Campo 'peso' actualizado aquí
                    peso_kg: Number(productoActualizado.peso),
                },

                // Precio (actualizado aquí)
                precio: {
                    precio_min: Number(productoActualizado.precioMin),
                    precio_max: Number(productoActualizado.precioMax),
                    moneda: String(productoActualizado.moneda ?? "PEN"), // Asumo PEN por defecto si no existe
                },

                // Almacen (asumimos que vienen del producto original)
                almacen: {
                    stock_actual: Number(productoActualizado.stock_actual) || 0,
                    stock_minimo: Number(productoActualizado.stock_minimo) || 0,
                    ubicacion: String(productoActualizado.ubicacion ?? ""),
                },
            };

            // 3. Llamar al servicio de actualización
            await ProductService.update(productoId, productoMapeado);

            toast.success("Producto actualizado correctamente.");
            // Navegar a la lista de productos después de guardar
            navigate("/products?tab=lista");

        } catch (err: any) {
            console.error("Error al actualizar el producto:", err.message);
            toast.error("Error al actualizar el producto: " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Función para renderizar la descripción del producto basada en sus atributos
    const renderDescripcion = (p: ProductoBase) => {
        // Usamos nullish coalescing para manejar campos potencialmente undefined
        const tipo = p.tipo ?? "";
        const ancho = p.ancho ?? "";
        const largo = p.largo ?? "";
        const gramaje = p.gramaje ?? "";
        const calibre = p.calibre ?? "";
        const unidad = (p.unidad as string)?.toLowerCase() ?? "";
        const pliegos = p.pliegos ?? "";
        const grade = p.grade ?? ""; // Incluimos el grade/descripción

        // Construir la descripción base de los atributos del material
        const materialDesc = `${ancho}x${largo} ${gramaje}g calibre ${calibre} ${unidad} ${pliegos} pliegos`.trim();

        let prefix = "";

        if (categoria === "BobinasCarton") {
            // Si es BobinasCarton, la categoría va al inicio (reemplazando al grade)
            prefix = categoria;
        } else {
            // Si no es BobinasCarton, se agrega la categoría después del grade
            prefix = `${grade} ${categoria}`.trim();
        }

        // Combinar el prefijo y la descripción del material.
        // split(/\s+/) y filter(Boolean) eliminan múltiples espacios y cadenas vacías.
        return `${prefix} ${tipo} ${materialDesc}`.split(/\s+/).filter(Boolean).join(' ');
    };

    return (
        <>
            <Table className="text-sm">
                <TableHeader>
                    <TableRow>
                        {["Producto", "Peso (kg)", "Precio Min", "Precio Max"].map((t) => (
                            <TableHead key={t}>{t}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productos.map((p, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium max-w-[400px]">
                                {renderDescripcion(p)}
                            </TableCell>
                            {["peso", "precioMin", "precioMax"].map((f) => (
                                <TableCell key={f}>
                                    <Input
                                        type="number"
                                        name={f}
                                        // ✅ CORRECCIÓN TS: Se asegura que el valor sea string para la prop 'value'
                                        value={String(p[f] ?? "")}
                                        onChange={(e) => handleChange(index, f, e.target.value)}
                                        className="h-7 text-sm"
                                        min="0"
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="fixed bottom-6 right-6 flex gap-2">
                <Button
                    className="cursor-pointer"
                    variant="outline"
                    onClick={() => navigate(-1)}
                >
                    Atrás
                </Button>
                <Button
                    className="cursor-pointer"
                    onClick={guardar}
                    disabled={isSaving || !validar()}
                >
                    {isSaving ? "Guardando..." : "Finalizar Edición"}
                </Button>
            </div>
        </>
    );
}