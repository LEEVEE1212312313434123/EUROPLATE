import { toast } from "sonner";
import { exportToCSV } from "@/utils/exportUtils";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { useUpdateProduct } from "@/hooks/products/useUpdateProduct";
import type { ProductWithRelations } from "@/types/products/product.relations";
import type { CreateProductDTO } from "@/types/products/product.dto";

function mapToCreateProductDTO(p: ProductWithRelations): CreateProductDTO {
  return {
    nombre_producto: p.nombre_producto,
    categoria: p.categoria,
    estado: p.estado,
    accion: p.accion ?? null,
    imagen: p.imagen ?? null,
    tipo: p.tipo ?? null,
    grade: p.grade ?? null,
    activo: p.activo,

    material: {
      tipo: p.materiales[0]?.tipo,
      dimensiones: {
        ancho_cm: p.materiales[0]?.ancho_cm,
        largo_cm: p.materiales[0]?.largo_cm,
      },
      gramaje_g: p.materiales[0]?.gramaje_g,
      calibre: p.materiales[0]?.calibre,
      pliegos_por_paquete: p.materiales[0]?.pliegos_por_paquete,
      unidad_medida: p.materiales[0]?.unidad_medida,
      peso_kg: p.materiales[0]?.peso_kg,
    },

    precio: {
      precio_min: p.precios[0]?.precio_min,
      precio_max: p.precios[0]?.precio_max,
      moneda: p.precios[0]?.moneda,
    },

    almacen: {
      stock_actual: p.almacenes[0]?.stock_actual ?? 0,
      stock_minimo: p.almacenes[0]?.stock_minimo ?? 0,
      ubicacion: p.almacenes[0]?.ubicacion,
    },
  };
}

export function useProductActions(filteredProducts: ProductWithRelations[]) {
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const handleDelete = (id: number) => {
    deleteProduct.mutate(id, {
      onSuccess: () => toast.success("Producto descontinuado correctamente"),
      onError: () => toast.error("No se pudo descontinuar el producto"),
    });
  };

  const handleSave = (product: ProductWithRelations) => {
    const dto = mapToCreateProductDTO(product);

    updateProduct.mutate(
      { id: product.id, dto },
      {
        onSuccess: () => toast.success("Producto actualizado"),
        onError: () => toast.error("Error al actualizar producto"),
      }
    );
  };

  const handleExportCSV = () => {
    if (!filteredProducts.length) {
      return toast.error("No hay productos para exportar");
    }

    exportToCSV(
      filteredProducts,
      [
        "Nombre",
        "Precio Min",
        "Precio Max",
        "Stock",
        "Estado",
        "Tipo",
        "Fecha",
        "Acción",
        "Imagen",
      ],
      (p) => [
        `"${p.nombre_producto.replace(/"/g, '""')}"`,
        (p.precios[0]?.precio_min ?? 0).toFixed(2),
        (p.precios[0]?.precio_max ?? 0).toFixed(2),
        (p.almacenes[0]?.stock_actual ?? 0).toString(),
        p.estado,
        p.tipo,
        p.fecha_registro,
        p.accion,
        p.imagen,
      ],
      "productos_exportados.csv"
    );
  };

  return {
    handleDelete,
    handleSave,
    handleExportCSV,
  };
}
