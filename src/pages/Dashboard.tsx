import DashboardTabs from "@/components/dashboard/DashboardTabs";

export default function Dashboard() {
  return (
    <div className="h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      <DashboardTabs />
    </div>
  );
}