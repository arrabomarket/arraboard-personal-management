import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
}

interface TaskCardProps {
  category: Category;
  onDelete: () => void;
  onAddTask: (categoryId: string, taskTitle: string) => void;
  onToggleTask: (categoryId: string, taskId: string) => void;
}

export default function TaskCard({ category, onDelete, onAddTask, onToggleTask }: TaskCardProps) {
  const [newTask, setNewTask] = useState("");
  const completedTasks = category.tasks.filter(task => task.completed).length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("A tennivaló nem lehet üres!");
      return;
    }
    onAddTask(category.id, newTask.trim());
    setNewTask("");
    toast.success("Tennivaló sikeresen hozzáadva!");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
        <Button
          variant="outline"
          size="icon"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {completedTasks}/{category.tasks.length} elvégzett tennivaló
          </p>
          
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Új tennivaló..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button type="submit">Hozzáad</Button>
          </form>

          <div className="space-y-2">
            {category.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2 rounded-lg border p-2">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(category.id, task.id)}
                />
                <label
                  htmlFor={task.id}
                  className={`flex-1 ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}