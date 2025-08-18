import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export function useQueryTabs(defaultTab: string) {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab");

  const activeTab = tabParam ?? defaultTab;

  const setActiveTab = (tab: string) => {
    setSearchParams({ tab });
  };

  useEffect(() => {
    if (!tabParam) {
      setSearchParams({ tab: defaultTab });
    }
  }, [tabParam, setSearchParams, defaultTab]);

  return { activeTab, setActiveTab };
}
