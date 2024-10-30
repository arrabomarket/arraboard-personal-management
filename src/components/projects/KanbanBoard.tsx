import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
}

interface KanbanBoardProps {
  id: string;
  title: string;
  onDelete: (id: string) => void;
}

export default function KanbanBoard({ id, title, onDelete }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<string | null>(null);

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem(`project-${id}-tasks`);
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, [id]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`project-${id}-tasks`, JSON.stringify(tasks));
  }, [tasks, id]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("A feladat neve nem lehet üres!");
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask.trim(),
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Feladat sikeresen hozzáadva!");
  };

  const handleEditTask = (taskId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error("A feladat neve nem lehet üres!");
      return;
    }

    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, title: newTitle.trim() } : task
    ));
    setEditingTask(null);
    toast.success("Feladat sikeresen módosítva!");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    toast.success("Feladat sikeresen törölve!");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // Töröljük a feladatokat is amikor a projektet töröljük
            localStorage.removeItem(`project-${id}-tasks`);
            onDelete(id);
          }}
          className="h-8 w-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between gap-2 rounded-lg border p-3"
              >
                {editingTask === task.id ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const input = e.currentTarget.querySelector('input');
                      if (input) handleEditTask(task.id, input.value);
                    }}
                    className="flex-1 flex gap-2"
                  >
                    <Input
                      defaultValue={task.title}
                      autoFocus
                      onBlur={(e) => handleEditTask(task.id, e.target.value)}
                    />
                  </form>
                ) : (
                  <>
                    <span className="flex-1">{task.title}</span>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingTask(task.id)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTask(task.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <form onSubmit={handleAddTask} className="flex gap-2">
            <Input
              placeholder="Új feladat..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}