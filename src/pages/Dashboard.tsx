import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import TimeWidget from "@/components/dashboard/TimeWidget";
import FinanceWidget from "@/components/dashboard/FinanceWidget";
import TasksWidget from "@/components/dashboard/TasksWidget";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import { startOfWeek, addDays } from "date-fns";
import { hu } from "date-fns/locale";

export default function Dashboard() {
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

  // Generate week days
  const startOfCurrentWeek = startOfWeek(currentTime, { locale: hu });
  const weekDays = Array.from({ length: 7 }).map((_, index) => {
    const date = addDays(startOfCurrentWeek, index);
    return {
      date,
      dayName: format(date, 'EEEEEE', { locale: hu }),
      dayNumber: format(date, 'd'),
      isToday: format(date, 'yyyy-MM-dd') === format(currentTime, 'yyyy-MM-dd')
    };
  });

  // Load high priority goals for dashboard
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
    <div className="h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      
      <div className="grid gap-4 bg-[#f5f5f5] p-4 rounded-lg">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <TimeWidget currentTime={currentTime} />
          <FinanceWidget monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TasksWidget tasks={todaysTasks} />
          <GoalsWidget goals={highPriorityGoals} />
        </div>

        {/* Calendar Widget */}
        <Card className="bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heti naptár</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              {weekDays.map((day) => (
                <div
                  key={day.date.toString()}
                  className={`flex flex-col items-center p-2 rounded-lg ${
                    day.isToday ? 'bg-[#13A3B5] text-white' : ''
                  }`}
                >
                  <span className="text-xs font-medium">{day.dayName}</span>
                  <span className="text-lg font-bold">{day.dayNumber}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}