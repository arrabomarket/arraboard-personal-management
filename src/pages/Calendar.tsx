import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { hu } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface TodoItem {
  id: string;
  date: Date;
  title: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    const fetchTodos = async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('calendar_todos')
        .select('*')
        .eq('user_id', user.user.id);

      if (error) {
        toast.error("Hiba történt a tennivalók betöltésekor");
        return;
      }

      if (data) {
        setTodos(data.map(todo => ({
          ...todo,
          date: new Date(todo.date)
        })));
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("A tennivaló nem lehet üres!");
      return;
    }

    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    const todo = {
      date: date,
      title: newTodo.trim(),
      user_id: user.user.id
    };

    const { data, error } = await supabase
      .from('calendar_todos')
      .insert([todo])
      .select()
      .single();

    if (error) {
      toast.error("Hiba történt a tennivaló mentésekor");
      return;
    }

    if (data) {
      setTodos([...todos, { ...data, date: new Date(data.date) }]);
      setNewTodo("");
      toast.success("Tennivaló sikeresen hozzáadva!");
    }
  };

  const handleDeleteTodo = async (todoId: string) => {
    const { error } = await supabase
      .from('calendar_todos')
      .delete()
      .eq('id', todoId);

    if (error) {
      toast.error("Hiba történt a tennivaló törlésekor");
      return;
    }

    setTodos(todos.filter((todo) => todo.id !== todoId));
    toast.success("Tennivaló sikeresen törölve!");
  };

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const previousMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const selectedDayTodos = todos.filter(
    (todo) => format(todo.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Naptár</h1>

      <div className="grid lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-5 xl:col-span-4">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={previousMonth}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {format(currentMonth, "MMMM yyyy", { locale: hu })}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextMonth}
                className="h-8 w-8"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() - 1 }).map((_, i) => (
                <div key={`empty-${i}`} className="h-10" />
              ))}
              {days.map((day) => {
                const isSelected = isSameDay(date, day);
                const isCurrentMonth = isSameMonth(currentMonth, day);
                const hasTodos = todos.some((todo) =>
                  isSameDay(new Date(todo.date), day)
                );

                return (
                  <Button
                    key={day.toISOString()}
                    variant={isSelected ? "default" : "ghost"}
                    className={cn(
                      "h-10 w-full p-0 font-normal",
                      !isCurrentMonth && "text-muted-foreground opacity-50",
                      hasTodos && !isSelected && "bg-accent/50"
                    )}
                    onClick={() => setDate(day)}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 xl:col-span-8">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {format(date, "yyyy. MMMM d.", { locale: hu })}
              </h2>
            </div>

            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                placeholder="Új tennivaló..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">Hozzáad</Button>
            </form>

            <div className="space-y-2 mt-4">
              {selectedDayTodos.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nincs tennivaló erre a napra
                </p>
              ) : (
                <div className="grid gap-2">
                  {selectedDayTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-center justify-between gap-2 rounded-lg border p-3 hover:bg-accent/50 transition-colors group"
                    >
                      <span className="flex-1">{todo.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}