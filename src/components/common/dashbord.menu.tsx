import { useEffect, useState } from "react";
import { SOLD_PRODUCTS_CONFIG } from "@/config/sold-products.config";
import type { SoldProduct } from "@/types/sold-product.types";
import { SoldProductDialog } from "@/components/common/sold-product-dialog";
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

export function DashboardMenu() {
  const [soldProducts, setSoldProducts] = useState<SoldProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [selectedProductForView, setSelectedProductForView] =
    useState<SoldProduct | null>(null);

  useEffect(() => {
    const fetchSoldProducts = async () => {
      try {
        const res = await fetch(SOLD_PRODUCTS_CONFIG.SOLD_PRODUCTS_JSON_PATH);
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }

        const data: SoldProduct[] = await res.json();
        setSoldProducts(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar los productos vendidos.");
        setError("Error al cargar los productos.");
      } finally {
        setLoading(false);
      }
    };

    fetchSoldProducts();
  }, []);

  const handleViewClick = (product: SoldProduct) => {
    setSelectedProductForView(product);
    setViewOpen(true);
    toast.info(`Abriendo detalles de "${product.productName}"`);
  };

  if (loading) return <div className="p-6">Cargando productos vendidos...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Productos Vendidos</h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Producto</TableHead>
            <TableHead>Precio Unitario</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Fecha de Venta</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {soldProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.productName}</TableCell>
              <TableCell>${product.unitPrice.toFixed(2)}</TableCell>
              <TableCell>{product.quantity}</TableCell>
              <TableCell>${product.total.toFixed(2)}</TableCell>
              <TableCell>
                {new Date(product.dateSold).toLocaleDateString("es-ES", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewClick(product)}
                >
                  Ver
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProductForView && (
        <SoldProductDialog
          open={viewOpen}
          product={selectedProductForView}
          onOpenChange={setViewOpen}
        />
      )}
    </div>
  );
}
