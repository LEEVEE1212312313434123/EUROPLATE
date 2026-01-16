import { useMemo, useState } from "react";

export function useComprasFilters(compras: any[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "import" | "nacional">("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredCompras = useMemo(() => {
    return compras.filter((c) => {
      const searchMatch =
        !searchTerm ||
        c.detalle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.num_dua?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!searchMatch) return false;

      if (filterType === "import" && c.pais_origen === "Perú") return false;
      if (filterType === "nacional" && c.pais_origen !== "Perú") return false;

      if (filterStatus !== "all" && c.estado !== filterStatus) return false;

      return true;
    });
  }, [compras, searchTerm, filterType, filterStatus]);

  return {
    filteredCompras,
    searchTerm,
    filterType,
    filterStatus,
    setSearchTerm,
    setFilterType,
    setFilterStatus,
  };
}
