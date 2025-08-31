import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useProducts } from "@/hooks/useProducts";
import { exportToCSV } from "@/utils/exportUtils";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/Producto/products.edit.dialog";
import { ProductDeleteDialog } from "@/components/common/Producto/product.delete.dialog";
import { Toolbar } from "@/components/common/Toolbar";
import { ProductTable } from "@/components/common/Producto/Products-Table";
import { Button } from "@/components/ui/button";

export function ProductsForm() {
  const { products, loading, error, handleDelete, handleSave } = useProducts();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const FILTER_TYPE_MAP: Record<string, string | null> = {
    all: null,
    product: "producto",
    service: "servicio",
  };
  const navigate = useNavigate();
  const STATUS_MAP: Record<string, string | null> = {
    all: null,
    Available: "Disponible",
    Unavailable: "No disponible",
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm && !p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())) return false;

      const tipoFilter = FILTER_TYPE_MAP[filterType];
      if (tipoFilter && p.tipo !== tipoFilter) return false;
      const statusFilter = STATUS_MAP[filterStatus];
      if (statusFilter && p.estado !== statusFilter) return false;

      return true;
    });
  }, [products, searchTerm, filterType, filterStatus]);

  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      toast.error("No hay productos para exportar");
      return;
    }

    exportToCSV(
      filteredProducts,
      [
        "Nombre Producto",
        "Precio Min",
        "Precio Max",
        "Stock Actual",
        "Estado",
        "Tipo",
        "Fecha Registro",
        "Acción",
        "Imagen",
      ],
      (p) => [
        `"${p.nombre_producto.replace(/"/g, '""')}"`,
        p.precio.precio_min.toFixed(2),
        p.precio.precio_max.toFixed(2),
        p.almacen.stock_actual.toString(),
        p.estado,
        p.tipo,
        p.fecha_registro,
        p.accion,
        p.imagen,
      ],
      "productos_exportados.csv"
    );
  };

  if (loading) return <div className="p-6">Cargando productos...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Productos</h2>
          <p className="text-muted-foreground text-sm">
            Administra todos los productos de tu empresa
          </p>
        </div>
        <Button
          onClick={() => navigate("/products/addProducts")}
          className="flex items-center gap-2 cursor-pointer"
        >
          + Agregar producto
        </Button>
      </div>

      <Toolbar
        filterType={filterType}
        filterStatus={filterStatus}
        tabs={[
          { value: "all", label: `Todos (${products.length})` },
          { value: "product", label: `Productos (${products.filter((p) => p.tipo === "producto").length})` },
          { value: "service", label: `Servicios (${products.filter((p) => p.tipo === "servicio").length})` },
        ]}
        selectOptions={[
          { value: "all", label: "Todos" },
          { value: "Available", label: "Disponible" },
          { value: "Unavailable", label: "No disponible" },
        ]}
        searchTerm={searchTerm}
        searchPlaceholder="Buscar producto..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={setFilterStatus}
        onSearchChange={setSearchTerm}
        onExport={handleExportCSV}
      />

      <ProductTable
        products={filteredProducts}
        onEdit={(p) => {
          setSelectedProduct(p);
          setEditOpen(true);
        }}
        onDelete={(p) => {
          setSelectedProduct(p);
          setDeleteOpen(true);
        }}
      />

      {selectedProduct && (
        <ProductEditDialog
          open={editOpen}
          product={selectedProduct}
          onClose={() => {
            setEditOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      {selectedProduct && (
        <ProductDeleteDialog
          open={deleteOpen}
          product={selectedProduct}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) setSelectedProduct(null);
          }}
          onDeleteConfirm={() => handleDelete(selectedProduct.id)}
        />
      )}
    </div>
  );
}
