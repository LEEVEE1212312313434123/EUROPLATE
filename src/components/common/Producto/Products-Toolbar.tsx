import { ProductFilterTabs } from "@/components/common/Producto/Products-Filter-Tabs";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Download } from "lucide-react";

interface ProductsToolbarProps {
  filterType: string;
  filterStatus: string;
  totalItemsCount: number;
  totalProductsCount: number;
  totalServicesCount: number;
  searchTerm: string;
  onFilterTypeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onExport: () => void;
}

export function ProductsToolbar({
  filterType,
  filterStatus,
  totalItemsCount,
  totalProductsCount,
  totalServicesCount,
  searchTerm,
  onFilterTypeChange,
  onFilterStatusChange,
  onSearchChange,
  onExport,
}: ProductsToolbarProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <ProductFilterTabs
          filterType={filterType}
          totalItemsCount={totalItemsCount}
          totalProductsCount={totalProductsCount}
          totalServicesCount={totalServicesCount}
          onFilterChange={onFilterTypeChange}
        />

        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-40 border rounded-md shadow-sm focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Available">Disponible</SelectItem>
            <SelectItem value="Unavailable">No disponible</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          variant="outline"
          onClick={onExport}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </Button>

        <Input
          type="text"
          placeholder="Buscar producto..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-60"
        />
      </div>
    </div>
  );
}
