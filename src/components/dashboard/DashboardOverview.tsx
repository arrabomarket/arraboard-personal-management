import { useState, useEffect } from "react";
import TimeWidget from "./TimeWidget";
import FinanceWidget from "./FinanceWidget";
import TasksWidget from "./TasksWidget";
import GoalsWidget from "./GoalsWidget";
import QuickAccessCard from "./QuickAccessCard";
import CalendarWidget from "./CalendarWidget";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Load today's tasks from calendar
  useEffect(() => {
    const savedTodos = localStorage.getItem("calendarTodos");
    if (savedTodos) {
      const todos = JSON.parse(savedTodos, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
      const today = format(new Date(), "yyyy-MM-dd");
      const todaysTodos = todos.filter((todo: any) => 
        format(new Date(todo.date), "yyyy-MM-dd") === today
      );
      setTodaysTasks(todaysTodos);
    }
  }, []);

  // Load transactions for monthly summary
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

  // Calculate monthly income and expenses
  const currentMonth = format(currentTime, "yyyy-MM");
  const monthlyTransactions = transactions.filter(t => 
    format(new Date(t.date), "yyyy-MM") === currentMonth
  );
  
  const monthlyIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const monthlyExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Load high priority goals
  const { data: highPriorityGoals } = useQuery({
    queryKey: ["high-priority-goals"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("desires")
        .select("*")
        .eq("priority", "magas")
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="space-y-4">
      {/* First Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TimeWidget currentTime={currentTime} />
        <FinanceWidget monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />
        <TasksWidget tasks={todaysTasks} />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GoalsWidget goals={highPriorityGoals} />
        <QuickAccessCard />
      </div>

      {/* Calendar Widget */}
      <CalendarWidget tasks={todaysTasks} />
    </div>
  );
}