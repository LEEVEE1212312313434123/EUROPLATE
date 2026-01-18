import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface TabConfig {
  value: string;
  label: string;
}

interface SelectConfig {
  value: string;
  label: string;
}

interface GenericToolbarProps {
  filterType: string;
  filterStatus: string;
  tabs: TabConfig[];
  selectOptions: SelectConfig[];
  searchTerm: string;
  searchPlaceholder?: string;
  onFilterTypeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onExport?: () => void;
}

export function Toolbar({
  filterType,
  filterStatus,
  tabs,
  selectOptions,
  searchTerm,
  searchPlaceholder = "Buscar...",
  onFilterTypeChange,
  onFilterStatusChange,
  onSearchChange,
  onExport,
}: GenericToolbarProps) {
  return (
    <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      
      {/* === BUSCADOR PRIMERO === */}
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 flex-1">
        <Input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full md:w-60"
        />

        {/* === SELECT DESPUÉS DEL INPUT === */}
        <Select value={filterStatus} onValueChange={onFilterStatusChange}>
          <SelectTrigger className="w-40 border rounded-md shadow-sm focus:ring-2 focus:ring-primary">
            <SelectValue placeholder="Seleccionar..." />
          </SelectTrigger>
          <SelectContent>
            {selectOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* === RESTO: TABS Y EXPORT === */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Tabs */}
        <Tabs value={filterType} onValueChange={onFilterTypeChange}>
          <TabsList className="gap-2 bg-transparent">
            {tabs
              .filter((tab) => tab.value !== "service")
              .map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 
                  cursor-pointer transition-colors
                  hover:bg-gray-100
                  data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
                  data-[state=active]:border-primary"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>

        {/* Export Button */}
        {onExport && (
          <Button
            variant="outline"
            onClick={onExport}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </Button>
        )}
      </div>
    </div>
  );
}