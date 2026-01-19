import { useMemo, useState } from "react";
import { formatProductName } from "@/utils/formatProductName";
import type { ProductWithRelations } from "@/types/products/product.relations";
import { TipoProductoEnum } from "@/types/products/product-type.enum";

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

  const [filterType, setFilterType] =
    useState<"all" | "product" | "service">("all");

  const [filterCategoria, setFilterCategoria] =
    useState<TipoProductoEnum | "all">("all");

  const [filterSubCategoria, setFilterSubCategoria] =
    useState<string | "all">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!options?.includeInactive && !p.activo) return false;

      if (searchTerm) {
        const name = normalize(formatProductName(p));
        if (!name.includes(normalize(searchTerm))) return false;
      }

      const mappedType = FILTER_TYPE_MAP[filterType];
      if (mappedType && p.tipo !== mappedType) return false;

      if (filterCategoria !== "all" && p.tipo_producto !== filterCategoria)
        return false;

      if (filterSubCategoria !== "all" && p.categoria !== filterSubCategoria)
        return false;

      return true;
    });
  }, [
    products,
    searchTerm,
    filterType,
    filterCategoria,
    filterSubCategoria,
    options?.includeInactive,
  ]);

  const countProducts = useMemo(
    () => products.filter((p) => p.tipo === "producto").length,
    [products]
  );

  const countServices = useMemo(
    () => products.filter((p) => p.tipo === "servicio").length,
    [products]
  );

  const handleTypeChange = (value: string) => {
    if (value in FILTER_TYPE_MAP) {
      setFilterType(value as keyof typeof FILTER_TYPE_MAP);
    }
  };

  const handleCategoriaChange = (value: string) => {
    if (value === "all") {
      setFilterCategoria("all");
      setFilterSubCategoria("all");
    } else {
      setFilterCategoria(value as TipoProductoEnum);
      setFilterSubCategoria("all");
    }
  };

  const handleSubCategoriaChange = (value: string) => {
    setFilterSubCategoria(value);
  };

  return {
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
  };
}
