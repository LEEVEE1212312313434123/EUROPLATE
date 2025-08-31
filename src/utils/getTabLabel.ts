import { TABS_CONFIG } from "@/config/tabs.config";

export function getTabLabel(routeKey: string, tabValue: string | null): string | null {
  if (!tabValue) return null;

  const tabs = (TABS_CONFIG as Record<string, { value: string; label: string }[]>)[routeKey];
  const tab = tabs?.find((t) => t.value === tabValue);

  return tab ? tab.label : null;
}
