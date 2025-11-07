import { useState, useEffect } from "react";
import { Package } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import ProductosEditarForm from "@/components/common/Producto/productos.EditarAgregar.form";
import ProductosEditarPreciosForm from "@/components/common/Producto/productos.EditarPrecios.form";
import type { Product } from "@/types/product.types";
import type { ProductoBase } from "@/components/common/Producto/productos.EditarAgregar.form";

export default function EditarProductosPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const location = useLocation();

    const [producto, setProducto] = useState<Product | null>(null);
    const [step, setStep] = useState(1);
    const [productos, setProductos] = useState<ProductoBase[]>([]);

    useEffect(() => {
        if (location.state && location.state.product) {
            setProducto(location.state.product);
        } else if (productId) {
            fetchProducto(productId);
        }
    }, [location.state, productId]);

    const fetchProducto = async (id: string) => {
        try {
            const response = await fetch(`/api/productos/${id}`);
            const data = await response.json();
            setProducto(data);
        } catch (error) {
            console.error("Error al cargar el producto", error);
        }
    };

    const avanzarPaso = (productoEditado: ProductoBase) => {
        setProductos([productoEditado]);
        setStep(2); 
    };

    return (
        <div className="space-y-6 ml-6">
            <div className="flex items-start gap-4">
                <Package className="h-12 w-12 text-primary mt-1" />
                <div>
                    <h1 className="text-xl font-semibold">Editar Producto</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Modifica los datos base para este producto
                    </p>

                    {step === 1 && producto && (
                        <div className="mt-6 ml-[36px]">
                            <ProductosEditarForm
                                producto={producto}  
                                navigate={navigate}
                                onNext={avanzarPaso}  // Ahora el tipo de función es compatible
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-10 ml-[100px] max-w-6xl">
                {step === 2 && producto && (
                    <ProductosEditarPreciosForm
                        categoria={producto.categoria}  // Pasamos la categoría
                        productosPrevios={productos}  // Pasamos los productos previos editados
                        navigate={navigate}
                    />
                )}
            </div>
        </div>
    );
}