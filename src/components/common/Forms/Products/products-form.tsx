import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import type { ProductWithRelations } from "@/types/products/product.relations";
import {
  useProducts,
  useProductFilters,
  useProductActions,
  ProductEditDialog,
  ProductDeleteDialog,
  ProductTable,
  Toolbar
} from "@/hooks/products/index";

export function ProductsForm() {
  const navigate = useNavigate();
  const { data: products = [], isLoading, error } = useProducts();

  const {
    filteredProducts,
    searchTerm,
    filterType,
    filterStatus,
    countProducts,
    countServices,
    setSearchTerm,
    handleTypeChange,
    handleStatusChange,
  } = useProductFilters(products);

  const { handleDelete, handleSave, handleExportCSV } =
    useProductActions(filteredProducts);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductWithRelations | null>(null);

  return (
    <ResourcePage
      title="Productos"
      subtitle="Administra todos los productos"
      isLoading={isLoading}
      error={error ? String(error) : null}
      headerActions={
        <Button onClick={() => navigate("/products/addProducts")}>
          + Agregar producto
        </Button>
      }
      toolbar={
        <Toolbar
          filterType={filterType}
          filterStatus={filterStatus}
          searchTerm={searchTerm}
          onFilterTypeChange={handleTypeChange}
          onFilterStatusChange={handleStatusChange}
          onSearchChange={setSearchTerm}
          tabs={[
            { value: "all", label: `Todos (${products.length})` },
            { value: "product", label: `Productos (${countProducts})` },
            { value: "service", label: `Servicios (${countServices})` },
          ]}
          selectOptions={[
            { value: "all", label: "Todos" },
            { value: "Available", label: "Disponible" },
            { value: "Few", label: "Pocos" },
            { value: "Unavailable", label: "No disponible" },
          ]}
          onExport={handleExportCSV}
        />
      }
    >
      <ProductTable
        products={filteredProducts}
        onEdit={(product) => {
          setSelectedProduct(product);
          setEditOpen(true);
        }}
        onDelete={(product) => {
          setSelectedProduct(product);
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
    </ResourcePage>
  );
}
