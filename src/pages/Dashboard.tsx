import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ListCheck, Calendar as CalendarIcon, Wallet, ExternalLink } from "lucide-react";
import { format, startOfWeek, addDays } from "date-fns";
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

  const quickLinks = [
    { name: 'VPS', url: 'https://plesk.arrabomarket.hu:8443/', icon: ExternalLink },
    { name: 'RACKHOST', url: 'https://www.rackhost.hu/site/serviceList', icon: ExternalLink },
    { name: 'CHAT GPT', url: 'https://chatgpt.com/', icon: ExternalLink },
  ];

  return (
    <div className="h-[calc(100vh-2rem)]">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      
      <div className="grid gap-4 bg-[#f5f5f5] p-4 rounded-lg">
        {/* First Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Time Widget */}
          <Card className="md:col-span-1 bg-[#13A3B5] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pontos idő</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {format(currentTime, "HH:mm:ss")}
              </div>
              <div className="text-xl mt-2">
                {format(currentTime, "yyyy. MMMM d.", { locale: hu })}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Finance Widget */}
          <Card className="md:col-span-2 bg-white">
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
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's Tasks */}
          <Card className="bg-black text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mai tennivalók</CardTitle>
              <ListCheck className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {todaysTasks.length === 0 ? (
                  <p className="text-white/70">Nincs mai tennivaló</p>
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

          {/* Quick Links */}
          <Card className="bg-[#13A3B5] text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gyors elérés</CardTitle>
              <ExternalLink className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                {quickLinks.map((link) => (
                  <Button
                    key={link.name}
                    variant="outline"
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={() => window.open(link.url, '_blank')}
                  >
                    <link.icon className="h-4 w-4 mr-2" />
                    {link.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Third Row */}
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