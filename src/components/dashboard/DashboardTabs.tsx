import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "./DashboardOverview";
import DashboardQuickAccess from "./DashboardQuickAccess";
import DashboardStatistics from "./DashboardStatistics";

export default function DashboardTabs() {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Áttekintés</TabsTrigger>
        <TabsTrigger value="quick-access">Gyors elérés</TabsTrigger>
        <TabsTrigger value="statistics">Statisztikák</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <DashboardOverview />
      </TabsContent>

      <TabsContent value="quick-access">
        <DashboardQuickAccess />
      </TabsContent>

      <TabsContent value="statistics">
        <DashboardStatistics />
      </TabsContent>
    </Tabs>
  );
}