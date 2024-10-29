import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { hu } from "date-fns/locale";

interface TodoItem {
  id: string;
  date: Date;
  title: string;
}

export default function CalendarPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState("");

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) {
      toast.error("A tennivaló nem lehet üres!");
      return;
    }

    const todo: TodoItem = {
      id: crypto.randomUUID(),
      date: date,
      title: newTodo.trim(),
    };

    setTodos([...todos, todo]);
    setNewTodo("");
    toast.success("Tennivaló sikeresen hozzáadva!");
  };

  const handleDeleteTodo = (todoId: string) => {
    setTodos(todos.filter((todo) => todo.id !== todoId));
    toast.success("Tennivaló sikeresen törölve!");
  };

  const selectedDayTodos = todos.filter(
    (todo) => format(todo.date, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Naptár</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            locale={hu}
            className="rounded-md border shadow-sm"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {format(date, "yyyy. MMMM d.", { locale: hu })}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleAddTodo} className="flex gap-2">
              <Input
                placeholder="Új tennivaló..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <Button type="submit">Hozzáad</Button>
            </form>

            <div className="space-y-2">
              {selectedDayTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center justify-between gap-2 rounded-lg border p-3"
                >
                  <span className="flex-1">{todo.title}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="h-8 w-8"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}