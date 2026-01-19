import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface TabConfig {
  value: string;
  label: string;
}

interface SelectConfig {
  value: string;
  label: string;
}

interface ToolbarProps {
  filterType: string;
  tabs: TabConfig[];

  searchTerm: string;
  searchPlaceholder?: string;

  onFilterTypeChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  categoria?: string;
  subCategoria?: string;

  categorias?: SelectConfig[];
  subCategorias?: SelectConfig[];

  onCategoriaChange?: (value: string) => void;
  onSubCategoriaChange?: (value: string) => void;

  onExport?: () => void;
}

export function Toolbar({
  filterType,
  categoria,
  subCategoria,
  categorias,
  subCategorias,
  tabs,
  searchTerm,
  searchPlaceholder = "Buscar...",
  onFilterTypeChange,
  onCategoriaChange,
  onSubCategoriaChange,
  onSearchChange,
  onExport,
}: ToolbarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* 🔹 BUSCADOR */}
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-60"
        />

        {categorias && categoria !== undefined && onCategoriaChange && (
          <Select value={categoria} onValueChange={onCategoriaChange}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categorias.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 🔹 SUBCATEGORÍA */}
        {subCategorias && subCategoria !== undefined && onSubCategoriaChange && (
          <Select value={subCategoria} onValueChange={onSubCategoriaChange}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Subcategoría" />
            </SelectTrigger>
            <SelectContent>
              {subCategorias.map((sc) => (
                <SelectItem key={sc.value} value={sc.value}>
                  {sc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* 🔹 TABS */}
        <Tabs value={filterType} onValueChange={onFilterTypeChange}>
          <TabsList className="gap-2 bg-transparent">
            {tabs
              .filter((tab) => tab.value !== "service")
              .map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="
                    px-5 py-3 text-sm font-medium rounded-md 
                    border border-gray-300 
                    cursor-pointer transition-colors
                    hover:bg-gray-100
                    data-[state=active]:bg-primary 
                    data-[state=active]:text-primary-foreground
                    data-[state=active]:border-primary
                  "
                >
                  {tab.label}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>
        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2 ml-auto"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        )}
      </div>
    </div>
  );
}
