import { useEffect, useState, useMemo } from "react";
import { PRODUCTS_CONFIG } from "@/config/products.config";
import type { Product } from "@/types/product.types";
import { ProductEditDialog } from "@/components/common/product-edit-dialog";
import { ProductDeleteDialog } from "@/components/common/product-delete-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Trash, Edit, Download } from "lucide-react";

export function DashboardProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] =
    useState<Product | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedProductForDelete, setSelectedProductForDelete] =
    useState<Product | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all"); // "all", "product", "service"
  const [filterStatus, setFilterStatus] = useState<string>("all"); // "all", "Available", etc.

  const navigate = useNavigate();

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

  const totalItemsCount = products.length;
  const totalProductsCount = products.filter(
    (p) => p.type === "product"
  ).length;
  const totalServicesCount = products.filter(
    (p) => p.type === "service"
  ).length;

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (
        searchTerm.trim() &&
        !p.productName.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;

      if (filterType !== "all" && p.type !== filterType) return false;

      if (filterStatus !== "all" && p.status !== filterStatus) return false;

      return true;
    });
  }, [products, searchTerm, filterType, filterStatus]);

  const handleEditClick = (product: Product) => {
    setSelectedProductForEdit(product);
    setEditOpen(true);
  };

  const handleDeleteClick = (product: Product) => {
    setSelectedProductForDelete(product);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = (productId: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    toast.success("Producto eliminado correctamente");
    setDeleteOpen(false);
    setSelectedProductForDelete(null);
  };

  const handleSave = (updatedProduct: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    toast.success("Producto actualizado correctamente");
    setEditOpen(false);
    setSelectedProductForEdit(null);
  };

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
      "Type",
      "Date Added",
      "Action",
      "Image",
    ];

    const rows = filteredProducts.map((p) => [
      `"${p.productName.replace(/"/g, '""')}"`,
      p.minPrice.toFixed(2),
      p.maxPrice.toFixed(2),
      p.stock.toString(),
      p.status,
      p.type,
      p.dateAdded,
      p.action,
      p.image,
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
          onClick={() => navigate("/productos/agregar1")}
          className="flex items-center gap-2"
        >
          + Agregar producto
        </Button>
      </div>

      <hr className="mt-12 mb-6 border-t border-border" />

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Tabs
            defaultValue="all"
            value={filterType}
            onValueChange={setFilterType}
          >
            <TabsList className="gap-2 bg-transparent">
              <TabsTrigger
                value="all"
                className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
              >
                Todos ({totalItemsCount})
              </TabsTrigger>
              <TabsTrigger
                value="product"
                className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
              >
                Productos ({totalProductsCount})
              </TabsTrigger>
              <TabsTrigger
                value="service"
                className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary"
              >
                Servicios ({totalServicesCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 border rounded-md shadow-sm focus:ring-2 focus:ring-primary">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Available">Disponible</SelectItem>
              {/* Agrega más estados si en el futuro hay más */}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            onClick={handleExportCSV}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
          <Input
            type="text"
            placeholder="Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-60"
          />
        </div>
      </div>

      <hr className="border-t border-border" />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead className="text-center w-[80px]">
              Precio Míni $
            </TableHead>
            <TableHead className="text-center w-[80px]">Precio Max $</TableHead>
            <TableHead className="text-center w-[80px]">Stock</TableHead>
            <TableHead className="text-center w-[90px]">Estatus</TableHead>
            <TableHead className="text-center w-[90px]">Acciones</TableHead>
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
                <TableCell className="text-center w-[80px]">
                  ${product.minPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center w-[80px]">
                  ${product.maxPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center w-[80px]">
                  {product.stock}
                </TableCell>
                <TableCell className="text-center w-[90px]">
                  {product.status}
                </TableCell>
                <TableCell className="text-center w-[90px]">
                  <div className="flex justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(product)}
                      className="text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteClick(product)}
                      className="text-primary hover:bg-primary/10 focus:ring-2 focus:ring-primary"
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
