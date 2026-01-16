import { DashboardForm } from "@/components/common/Forms/Dashboard/dashboard-form";
import { TABS_CONFIG } from "@/config/tabs.config";
import { DashboardTabs } from "@/components/common/Dashboards/dashboard-tabs";
import { useQueryTabs } from "@/hooks/useQueryTabs";

export function DashboardPage() {
    const { activeTab, setActiveTab } = useQueryTabs("analisis");
  return (
      <div>
        <div className="inline-flex">
          <DashboardTabs
            activeTab={activeTab}
            onChange={setActiveTab}
            tabs={TABS_CONFIG.dashboard}
          />
        </div>
  
        <div className="mt-4">
          {activeTab === "analisis" && <DashboardForm />}
        </div>
      </div>
    );
}
