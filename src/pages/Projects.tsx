import { useState } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import KanbanColumn from "@/components/projects/KanbanColumn";

interface Task {
  id: string;
  content: string;
  status: "todo" | "inProgress" | "done";
}

export default function Projects() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  const columns = [
    { id: "todo", title: "Tennivalók" },
    { id: "inProgress", title: "Folyamatban" },
    { id: "done", title: "Kész" },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overColumn = over.id;

    if (activeTask && typeof overColumn === "string") {
      setTasks(
        tasks.map((task) =>
          task.id === activeTask.id
            ? { ...task, status: overColumn as Task["status"] }
            : task
        )
      );
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("A feladat neve nem lehet üres!");
      return;
    }

    const task: Task = {
      id: crypto.randomUUID(),
      content: newTask.trim(),
      status: "todo",
    };

    setTasks([...tasks, task]);
    setNewTask("");
    toast.success("Feladat sikeresen hozzáadva!");
  };

  const clearDoneTasks = () => {
    setTasks(tasks.filter((task) => task.status !== "done"));
    toast.success("Befejezett feladatok törölve!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projektek</h1>
      </div>

      <form onSubmit={handleAddTask} className="flex gap-4">
        <Input
          placeholder="Új feladat..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Hozzáad
        </Button>
      </form>

      <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              tasks={tasks.filter((task) => task.status === column.id)}
              showClearButton={column.id === "done"}
              onClear={clearDoneTasks}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
}