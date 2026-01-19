import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { ResourcePage } from "@/components/common/ResourcePage";
import { Button } from "@/components/ui/button";
import type { ProductWithRelations } from "@/types/products/product.relations";
import { PRODUCT_CATEGORIES } from "@/hooks/products/constants/product-categories";
import { TipoProductoEnum } from "@/types/products/product-type.enum";

import {
  useProducts,
  useProductFilters,
  useProductActions,
  ProductEditDialog,
  ProductDeleteDialog,
  ProductTable,
  Toolbar,
} from "@/hooks/products";

export function ProductsForm() {
  const navigate = useNavigate();
  const { data: products = [], isLoading, error } = useProducts();

  const {
    filteredProducts,
    searchTerm,
    filterType,
    filterCategoria,
    filterSubCategoria,
    countProducts,
    countServices,
    setSearchTerm,
    handleTypeChange,
    handleCategoriaChange,
    handleSubCategoriaChange,
  } = useProductFilters(products);

  const { handleDelete, handleSave, handleExportCSV } =
    useProductActions(filteredProducts);

  const categorias = [
    { value: "all", label: "Todas las categorías" },
    { value: TipoProductoEnum.MATERIA_PRIMA, label: "Materia Prima" },
    { value: TipoProductoEnum.PRODUCTO_TERMINADO, label: "Productos Terminados" },
    { value: TipoProductoEnum.INSUMO_PRODUCCION, label: "Insumos de Producción" },
    { value: TipoProductoEnum.SUMINISTRO_TECNICO, label: "Suministros Técnicos" },
  ];

  const subCategorias = useMemo(() => {
    if (filterCategoria === "all") {
      return [{ value: "all", label: "Todas las subcategorías" }];
    }

    return [
      { value: "all", label: "Todas las subcategorías" },
      ...PRODUCT_CATEGORIES[filterCategoria].map((c) => ({
        value: c,
        label: c,
      })),
    ];
  }, [filterCategoria]);

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
          categoria={filterCategoria}
          subCategoria={filterSubCategoria}
          categorias={categorias}
          subCategorias={subCategorias}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onFilterTypeChange={handleTypeChange}
          onCategoriaChange={handleCategoriaChange}
          onSubCategoriaChange={handleSubCategoriaChange}
          tabs={[
            { value: "all", label: `Todos (${products.length})` },
            { value: "product", label: `Productos (${countProducts})` },
            { value: "service", label: `Servicios (${countServices})` },
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
