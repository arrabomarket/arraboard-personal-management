import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TimeWidget from "@/components/dashboard/TimeWidget";
import FinanceWidget from "@/components/dashboard/FinanceWidget";
import TasksWidget from "@/components/dashboard/TasksWidget";
import GoalsWidget from "@/components/dashboard/GoalsWidget";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, ListTodo, FileText, Link2, Contact2, Wallet } from "lucide-react";

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

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Áttekintés</TabsTrigger>
          <TabsTrigger value="quick-access">Gyors elérés</TabsTrigger>
          <TabsTrigger value="statistics">Statisztikák</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* First Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TimeWidget currentTime={currentTime} />
            <FinanceWidget monthlyIncome={monthlyIncome} monthlyExpenses={monthlyExpenses} />
            <TasksWidget tasks={todaysTasks} />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GoalsWidget goals={highPriorityGoals} />
            
            {/* Quick Access Links */}
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Gyors elérés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <a href="/tasks" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <ListTodo className="h-5 w-5 text-primary" />
                    <span>Tennivalók</span>
                  </a>
                  <a href="/notes" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <FileText className="h-5 w-5 text-primary" />
                    <span>Jegyzetek</span>
                  </a>
                  <a href="/links" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Link2 className="h-5 w-5 text-primary" />
                    <span>Linkek</span>
                  </a>
                  <a href="/contacts" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Contact2 className="h-5 w-5 text-primary" />
                    <span>Kapcsolatok</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar Widget */}
          <Card className="bg-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mai teendők</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysTasks.length === 0 ? (
                  <p className="text-muted-foreground">Nincs mai tennivaló</p>
                ) : (
                  todaysTasks.map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-2 rounded-lg border bg-gray-50">
                      <span>{task.title}</span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quick-access">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Legutóbbi jegyzetek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Notes will be loaded here */}
                  <p className="text-muted-foreground">Nincs megjeleníthető jegyzet</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Legutóbbi linkek</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Links will be loaded here */}
                  <p className="text-muted-foreground">Nincs megjeleníthető link</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Legutóbbi kapcsolatok</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Contacts will be loaded here */}
                  <p className="text-muted-foreground">Nincs megjeleníthető kapcsolat</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Pénzügyi áttekintés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Havi bevétel:</span>
                    <span className="text-green-600">+{monthlyIncome.toLocaleString('hu-HU')} Ft</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Havi kiadás:</span>
                    <span className="text-red-600">-{monthlyExpenses.toLocaleString('hu-HU')} Ft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle>Feladatok állapota</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Task statistics will be loaded here */}
                  <p className="text-muted-foreground">Nincs megjeleníthető statisztika</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}