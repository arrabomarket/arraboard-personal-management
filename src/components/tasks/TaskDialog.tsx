import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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

interface TaskDialogProps {
  category: Category;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddTask: (categoryId: string, taskTitle: string) => void;
  onToggleTask: (categoryId: string, taskId: string) => void;
}

export default function TaskDialog({
  category,
  open,
  onOpenChange,
  onAddTask,
  onToggleTask,
}: TaskDialogProps) {
  const [newTask, setNewTask] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("A tennivaló neve nem lehet üres!");
      return;
    }
    onAddTask(category.id, newTask.trim());
    setNewTask("");
    toast.success("Tennivaló sikeresen hozzáadva!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category.name} - Tennivalók</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Új tennivaló..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button type="submit">Hozzáad</Button>
          </form>
          <div className="space-y-4">
            {category.tasks.map((task) => (
              <div key={task.id} className="flex items-center space-x-2">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => onToggleTask(category.id, task.id)}
                />
                <label
                  htmlFor={task.id}
                  className={`text-sm ${
                    task.completed ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {task.title}
                </label>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}