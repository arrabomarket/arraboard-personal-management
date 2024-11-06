import { useState, useEffect } from "react";
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

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("calendarTodos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("calendarTodos", JSON.stringify(todos));
  }, [todos]);

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

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            locale={hu}
            className="rounded-md border shadow-sm w-full p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4 w-full",
              caption: "flex justify-center pt-1 relative items-center text-sm",
              caption_label: "text-sm font-medium",
              nav: "space-x-1 flex items-center",
              nav_button: "h-6 w-6 bg-transparent p-0 text-muted-foreground",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex w-full",
              head_cell: "text-muted-foreground rounded-md w-8 font-normal text-[0.7rem]",
              row: "flex w-full mt-1",
              cell: "text-center text-sm relative p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-7 w-7 p-0 font-normal text-xs aria-selected:opacity-100",
              day_range_end: "day-range-end",
              day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
              day_today: "bg-accent text-accent-foreground",
              day_outside: "day-outside text-muted-foreground opacity-50",
              day_disabled: "text-muted-foreground opacity-50",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>

        <Card className="col-span-8">
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
