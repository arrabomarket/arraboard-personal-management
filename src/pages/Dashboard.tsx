import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Projector, Calendar, ListCheck, ChartBar } from "lucide-react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock data for demonstration
  const mockProjects = 5;
  const mockTodos = [
    { id: 1, title: "Megbeszélés 10:00-kor" },
    { id: 2, title: "Email küldése" },
    { id: 3, title: "Dokumentáció írása" },
  ];
  const mockFinanceData = [
    { name: "Jan", bevétel: 400000, kiadás: 300000 },
    { name: "Feb", bevétel: 500000, kiadás: 400000 },
    { name: "Már", bevétel: 450000, kiadás: 350000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Irányítópult</h1>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projektek száma</CardTitle>
            <Projector className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockProjects} projekt</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dátum</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {format(currentTime, "yyyy. MMMM d.", { locale: hu })}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Közelgő tennivalók</CardTitle>
            <ListCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <span>{todo.title}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Havi kiadás/bevétel</CardTitle>
            <ChartBar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <BarChart
                width={800}
                height={300}
                data={mockFinanceData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bevétel" fill="#4ade80" name="Bevétel" />
                <Bar dataKey="kiadás" fill="#f87171" name="Kiadás" />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}