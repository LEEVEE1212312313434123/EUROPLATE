import { useState } from "react";
import type { ProductWithRelations } from "@/types/products/product.relations";
import { ResourcePage } from "@/components/common/ResourcePage";
import {
  useDiscontinuedProducts,
  useProductFilters,
  ProductDeleteDialog,
  ProductTableSimple,
  Toolbar
} from "@/hooks/products_discontinued/index";

export function DiscontinuedProductsForm() {
  const { products, loading, error, handleDelete, handleRestore } =
    useDiscontinuedProducts();
  const {
    filteredProducts,
    searchTerm,
    filterType,
    setSearchTerm,
    handleTypeChange,
  } = useProductFilters(products, { includeInactive: true });

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  return (
    <ResourcePage
      title="Productos Descontinuados"
      subtitle="Administra los productos retirados o inactivos"
      isLoading={loading}
      error={error ? String(error) : null}
      headerActions={null}
      toolbar={
        <Toolbar
          filterType={filterType}
          filterStatus="Descontinuado"
          tabs={[
            { value: "all", label: `Todos (${products.length})` },
            {
              value: "product",
              label: `Productos (${products.filter((p) => p.tipo === "producto").length})`,
            },
            {
              value: "service",
              label: `Servicios (${products.filter((p) => p.tipo === "servicio").length})`,
            },
          ]}
          selectOptions={[]}
          searchTerm={searchTerm}
          searchPlaceholder="Buscar producto descontinuado..."
          onFilterTypeChange={handleTypeChange}
          onFilterStatusChange={() => {}}
          onSearchChange={setSearchTerm}
          onExport={() => {}}
        />
      }
    >
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
    </ResourcePage>
  );
}
