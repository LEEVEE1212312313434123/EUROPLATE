import { useMemo, useState } from "react";
import { formatProductName } from "@/utils/formatProductName";
import type { ProductWithRelations } from "@/types/products/product.relations";

const FILTER_TYPE_MAP = {
  all: null,
  product: "producto",
  service: "servicio",
} as const;

const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

interface UseProductFiltersOptions {
  includeInactive?: boolean;
}

export function useProductFilters(
  products: ProductWithRelations[],
  options?: UseProductFiltersOptions
) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "product" | "service">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "Available" | "Few" | "Unavailable">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!options?.includeInactive && !p.activo) return false;
      if (searchTerm) {
        const name = normalize(formatProductName(p));
        if (!name.includes(normalize(searchTerm))) return false;
      }
      const mappedType = FILTER_TYPE_MAP[filterType];
      if (mappedType && p.tipo !== mappedType) return false;
      const stock = p.almacenes[0]?.stock_actual ?? 0;
      const stockMatches =
        (filterStatus === "Available" && stock > 5) ||
        (filterStatus === "Few" && stock > 0 && stock <= 5) ||
        (filterStatus === "Unavailable" && stock === 0) ||
        filterStatus === "all";

      if (!stockMatches) return false;

      return true;
    });
  }, [products, searchTerm, filterType, filterStatus, options?.includeInactive]);

  const countProducts = useMemo(
    () => products.filter((p) => p.tipo === "producto").length,
    [products]
  );

  const countServices = useMemo(
    () => products.filter((p) => p.tipo === "servicio").length,
    [products]
  );

  const handleTypeChange = (value: string) => {
    if (value in FILTER_TYPE_MAP) setFilterType(value as keyof typeof FILTER_TYPE_MAP);
  };

  const handleStatusChange = (value: string) => {
    if (["all", "Available", "Few", "Unavailable"].includes(value))
      setFilterStatus(value as typeof filterStatus);
  };

  return {
    filteredProducts,
    searchTerm,
    filterType,
    filterStatus,
    countProducts,
    countServices,
    setSearchTerm,
    handleTypeChange,
    handleStatusChange,
  };
}
