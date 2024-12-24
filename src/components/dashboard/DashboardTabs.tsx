import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import DashboardOverview from "./DashboardOverview";
import DashboardQuickAccess from "./DashboardQuickAccess";
import DashboardStatistics from "./DashboardStatistics";

export default function DashboardTabs() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  // Load transactions and calculate monthly totals
  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      const parsedTransactions = JSON.parse(savedTransactions, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      setTransactions(parsedTransactions);

      const currentMonth = format(new Date(), "yyyy-MM");
      const monthlyTransactions = parsedTransactions.filter((t: any) => 
        format(new Date(t.date), "yyyy-MM") === currentMonth
      );
      
      const income = monthlyTransactions
        .filter((t: any) => t.type === 'income')
        .reduce((sum: number, t: any) => sum + t.amount, 0);
      
      const expenses = monthlyTransactions
        .filter((t: any) => t.type === 'expense')
        .reduce((sum: number, t: any) => sum + t.amount, 0);

      setMonthlyIncome(income);
      setMonthlyExpenses(expenses);
    }
  }, []);

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
        <DashboardStatistics 
          monthlyIncome={monthlyIncome}
          monthlyExpenses={monthlyExpenses}
        />
      </TabsContent>
    </Tabs>
  );
}