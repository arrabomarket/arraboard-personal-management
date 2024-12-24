import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardOverview from "./DashboardOverview";
import DashboardQuickAccess from "./DashboardQuickAccess";
import DashboardStatistics from "./DashboardStatistics";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export default function DashboardTabs() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const currentMonth = format(new Date(), "yyyy-MM");

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setTransactions(parsedTransactions);
    }
  }, []);

  const monthlyTransactions = transactions.filter(t => 
    format(new Date(t.date), "yyyy-MM") === currentMonth
  );
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

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
        <DashboardStatistics monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />
      </TabsContent>
    </Tabs>
  );
}