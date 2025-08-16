import { useEffect, useState, useMemo } from "react";
import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/product-edit-dialog";
import { ProductDeleteDialog } from "@/components/common/product-delete-dialog"; // Diálogo de eliminar
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Trash, Edit, Download } from "lucide-react";

export function DashboardProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para diálogos
  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  // Estado búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all"); // "all", "active", "inactive", etc
  const [filterStockMin, setFilterStockMin] = useState<number | "">("");
  const [filterMaxPrice, setFilterMaxPrice] = useState<number | "">("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(PRODUCTS_CONFIG.PRODUCTS_JSON_PATH);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        setError("No se pudieron cargar los productos.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Contadores para indicadores
  const totalItemsCount = products.length;
  // Suposición: 'service' es un status que identifica servicios
  const totalServicesCount = products.filter(
    (p) => p.status.toLowerCase() === "service"
  ).length;
  const totalProductsCount = totalItemsCount - totalServicesCount;

  // Filtrar productos según búsqueda y filtros
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Buscar por nombre
      if (
        searchTerm.trim() &&
        !p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      // Filtrar status
      if (filterStatus !== "all" && p.status.toLowerCase() !== filterStatus)
        return false;

      // Filtrar stock mínimo
      if (filterStockMin !== "" && p.stock < filterStockMin) return false;

      // Filtrar precio máximo (usamos maxPrice para filtro)
      if (filterMaxPrice !== "" && p.maxPrice > filterMaxPrice) return false;

      return true;
    });
  }, [products, searchTerm, filterStatus, filterStockMin, filterMaxPrice]);

  // Handlers para abrir diálogos
  const handleEditClick = (product: Product) => {
    setSelectedProductForEdit(product);
    setEditOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProductForDelete(product);
    setDeleteOpen(true);
  };

  // Confirmar eliminación
  const handleDeleteConfirm = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Producto eliminado correctamente");
    setDeleteOpen(false);
    setSelectedProductForDelete(null);
  };

  // Guardar producto actualizado
  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Producto actualizado correctamente");
    setEditOpen(false);
    setSelectedProductForEdit(null);
  };

  // Exportar CSV
  const handleExportCSV = () => {
    if (filteredProducts.length === 0) {
      toast.error("No hay productos para exportar");
      return;
    }

    const headers = [
      "Product Name",
      "Min Price",
      "Max Price",
      "Stock",
      "Status",
    ];
    const rows = filteredProducts.map((p) => [
      `"${p.productName.replace(/"/g, '""')}"`,
      p.minPrice.toFixed(2),
      p.maxPrice.toFixed(2),
      p.stock.toString(),
      p.status,
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "productos_exportados.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exportación completada");
  };

  if (loading) {
    return <div className="p-6">Cargando productos...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Listado de Productos</h2>

      {/* Filtros y búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Indicadores a la izquierda */}
        <div className="flex gap-3 flex-wrap items-center">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold select-none">
            Total: {totalItemsCount}
          </div>
          <div className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold select-none">
            Productos: {totalProductsCount}
          </div>
          <div className="bg-accent text-accent-foreground px-3 py-1 rounded-full text-sm font-semibold select-none">
            Servicios: {totalServicesCount}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 items-center">
          <select
            className="border rounded-lg px-3 py-2 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Filtrar por estado"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Todos los estados</option>
            {/* Ajusta estos valores según tus estados reales */}
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
            <option value="service">Servicio</option>
          </select>

          <input
            type="number"
            min={0}
            placeholder="Stock mínimo"
            className="border rounded-lg px-3 py-2 w-36 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Filtrar por stock mínimo"
            value={filterStockMin}
            onChange={(e) =>
              setFilterStockMin(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />

          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Precio máximo"
            className="border rounded-lg px-3 py-2 w-36 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            aria-label="Filtrar por precio máximo"
            value={filterMaxPrice}
            onChange={(e) =>
              setFilterMaxPrice(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
          />
        </div>

        {/* Búsqueda + export */}
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Buscar producto..."
            className="border rounded-lg px-3 py-2 w-60 bg-background text-foreground shadow-sm focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Buscar producto"
          />
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Min Price</TableHead>
            <TableHead>Max Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                No se encontraron productos.
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>${product.minPrice.toFixed(2)}</TableCell>
                <TableCell>${product.maxPrice.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditClick(product)}
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(product)}
                      className="cursor-pointer flex items-center gap-1"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Dialog para editar producto */}
      {selectedProductForEdit && (
        <ProductEditDialog
          open={editOpen}
          product={selectedProductForEdit}
          onClose={() => {
            setEditOpen(false);
            setSelectedProductForEdit(null);
          }}
          onSave={handleSave}
        />
      )}

      {/* Dialog para eliminar producto */}
      {selectedProductForDelete && (
        <ProductDeleteDialog
          open={deleteOpen}
          product={selectedProductForDelete}
          onOpenChange={(open) => {
            setDeleteOpen(open);
            if (!open) setSelectedProductForDelete(null);
          }}
          onDeleteConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}
