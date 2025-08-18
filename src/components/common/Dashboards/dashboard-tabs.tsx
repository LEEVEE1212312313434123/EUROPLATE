// components/common/dashboard-tabs.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface DashboardTab {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface DashboardTabsProps {
  activeTab: string;
  onChange: (value: string) => void;
  tabs: DashboardTab[];
}

export function DashboardTabs({ activeTab, onChange, tabs }: DashboardTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onChange} className="w-full">
      <TabsList className="h-auto rounded-none border-b border-border bg-transparent p-0 w-full justify-start">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "relative rounded-none px-3 py-2 text-sm font-medium text-muted-foreground cursor-pointer",
              "data-[state=active]:text-primary data-[state=active]:shadow-none",
              "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-transparent",
              "data-[state=active]:after:bg-primary"
            )}
          >
            {tab.icon && <span className="mr-1">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
