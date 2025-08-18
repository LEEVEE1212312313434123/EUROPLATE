import { TABS_CONFIG } from "@/config/tabs.config";

export function getTabLabel(section: keyof typeof TABS_CONFIG, tab: string) {
  const found = TABS_CONFIG[section]?.find((t) => t.value === tab);
  return found ? found.label : tab;
}
