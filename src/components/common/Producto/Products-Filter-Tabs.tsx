import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductFilterTabsProps {
  filterType: string;
  totalItemsCount: number;
  totalProductsCount: number;
  totalServicesCount: number;
  onFilterChange: (value: string) => void;
}

export function ProductFilterTabs({
  filterType,
  totalItemsCount,
  totalProductsCount,
  totalServicesCount,
  onFilterChange,
}: ProductFilterTabsProps) {
  return (
    <Tabs defaultValue="all" value={filterType} onValueChange={onFilterChange}>
      <TabsList className="gap-2 bg-transparent">
        <TabsTrigger
          value="all"
          className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 
          cursor-pointer transition-colors
          hover:bg-gray-100 
          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
          data-[state=active]:border-primary"
        >
          Todos ({totalItemsCount})
        </TabsTrigger>

        <TabsTrigger
          value="product"
          className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 
          cursor-pointer transition-colors
          hover:bg-gray-100
          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
          data-[state=active]:border-primary"
        >
          Productos ({totalProductsCount})
        </TabsTrigger>

        <TabsTrigger
          value="service"
          className="px-5 py-3 text-sm font-medium rounded-md border border-gray-300 
          cursor-pointer transition-colors
          hover:bg-gray-100
          data-[state=active]:bg-primary data-[state=active]:text-primary-foreground 
          data-[state=active]:border-primary"
        >
          Servicios ({totalServicesCount})
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
