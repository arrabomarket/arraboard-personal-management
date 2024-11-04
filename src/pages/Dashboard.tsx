import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, ListCheck, Calendar as CalendarIcon, Wallet } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
import { hu } from "date-fns/locale";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todaysTasks, setTodaysTasks] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  const [allTasks, setAllTasks] = useState<{ total: number; completed: number }>({
    total: 0,
    completed: 0
  });

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

  // Load all tasks
  useEffect(() => {
    const savedCategories = localStorage.getItem("taskCategories");
    if (savedCategories) {
      const categories = JSON.parse(savedCategories);
      const totalTasks = categories.reduce((acc: number, cat: any) => acc + cat.tasks.length, 0);
      const completedTasks = categories.reduce((acc: number, cat: any) => 
        acc + cat.tasks.filter((task: any) => task.completed).length, 0);
      setAllTasks({ total: totalTasks, completed: completedTasks });
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

  return (
    <div className="h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* Time Widget */}
        <Card className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pontos idő</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(currentTime, "HH:mm:ss")}
            </div>
          </CardContent>
        </Card>

        {/* Date Widget */}
        <Card className="h-[160px] bg-[#13A3B5] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dátum</CardTitle>
            <CalendarIcon className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(currentTime, "yyyy. MMMM d.", { locale: hu })}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Finance Widget */}
        <Card className="h-[160px]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Havi pénzügyek</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Bevétel:</span>
              <span className="text-green-600">+{monthlyIncome.toLocaleString('hu-HU')} Ft</span>
            </div>
            <div className="flex justify-between">
              <span>Kiadás:</span>
              <span className="text-red-600">-{monthlyExpenses.toLocaleString('hu-HU')} Ft</span>
            </div>
          </CardContent>
        </Card>

        {/* Today's Tasks Widget */}
        <Card className="h-[160px] bg-black text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mai tennivalók</CardTitle>
            <ListCheck className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {todaysTasks.length === 0 ? (
                <p className="text-muted">Nincs mai tennivaló</p>
              ) : (
                todaysTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between rounded-lg border border-white/20 p-2">
                    <span>{task.title}</span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Week Calendar Widget */}
        <Card className="h-[160px] md:col-span-2">
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
                    day.isToday ? 'bg-black text-white' : ''
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
