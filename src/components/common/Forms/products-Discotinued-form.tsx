import { useState, useMemo } from "react";
import { useDiscontinuedProducts } from "@/hooks/useDiscontinuedProducts";
import type { Product } from "@/types/product.types";
import { ProductDeleteDialog } from "@/components/common/Producto/product.delete.dialog";
import { Toolbar } from "@/components/common/Toolbar";
import { ProductTableSimple } from "@/components/common/Producto/Products-Table-Simple";

export function DiscontinuedProductsForm() {
  const { products, loading, error, handleDelete, handleRestore } = useDiscontinuedProducts();
  console.log(products);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const FILTER_TYPE_MAP: Record<string, string | null> = {
    all: null,
    product: "producto",
    service: "servicio",
  };

  // 🔍 Filtrado por nombre y tipo
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchTerm && !p.nombre_producto.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      const tipoFilter = FILTER_TYPE_MAP[filterType];
      if (tipoFilter && p.tipo !== tipoFilter) return false;
      return true;
    });
  }, [products, searchTerm, filterType]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Productos Descontinuados</h2>
          <p className="text-muted-foreground text-sm">
            Administra los productos descontinuados de tu empresa
          </p>
        </div>
      </div>
      <Toolbar
        filterType={filterType}
        filterStatus={"Descontinuado"}
        tabs={[
          { value: "all", label: `Todos (${products.length})` },
          { value: "product", label: `Productos (${products.filter((p) => p.tipo === "producto").length})` },
          { value: "service", label: `Servicios (${products.filter((p) => p.tipo === "servicio").length})` },
        ]}
        selectOptions={[]} // ❌ sin select
        searchTerm={searchTerm}
        searchPlaceholder="Buscar producto descontinuado..."
        onFilterTypeChange={setFilterType}
        onFilterStatusChange={() => { }}
        onSearchChange={setSearchTerm}
        onExport={() => { }}
      />

      <ProductTableSimple
        products={filteredProducts}
        onRestore={(p) => handleRestore(p.id)}
        onDelete={(p) => {
          setSelectedProduct(p);
          setDeleteOpen(true);
        }}
      />
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
