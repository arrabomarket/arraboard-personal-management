import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import KanbanColumn from "@/components/projects/KanbanColumn";
import { supabase } from "@/integrations/supabase/client";

interface Task {
  id: string;
  content: string;
  status: "todo" | "inProgress" | "done";
}

export default function Projects() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const columns = [
    { id: "todo", title: "Tennivalók" },
    { id: "inProgress", title: "Folyamatban" },
    { id: "done", title: "Kész" },
  ];

  // Load tasks from Supabase on component mount
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('project_tasks')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        const formattedTasks: Task[] = data.map(task => ({
          id: task.id,
          content: task.title,
          status: task.status as Task["status"],
        }));

        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error loading tasks:', error);
        toast.error('Hiba történt a feladatok betöltésekor');
      } finally {
        setIsLoading(false);
      }
    };

    loadTasks();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTask = tasks.find((task) => task.id === active.id);
    const overColumn = over.id;

    if (activeTask && typeof overColumn === "string") {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const updatedTasks = tasks.map((task) =>
          task.id === activeTask.id
            ? { ...task, status: overColumn as Task["status"] }
            : task
        );

        const { error } = await supabase
          .from('project_tasks')
          .update({ status: overColumn })
          .eq('id', activeTask.id)
          .eq('user_id', user.id);

        if (error) throw error;

        setTasks(updatedTasks);
      } catch (error) {
        console.error('Error updating task status:', error);
        toast.error('Hiba történt a feladat áthelyezésekor');
      }
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) {
      toast.error("A feladat neve nem lehet üres!");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          title: newTask.trim(),
          status: 'todo',
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newTaskObj: Task = {
        id: data.id,
        content: data.title,
        status: data.status as Task["status"],
      };

      setTasks([...tasks, newTaskObj]);
      setNewTask("");
      toast.success("Feladat sikeresen hozzáadva!");
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Hiba történt a feladat hozzáadásakor');
    }
  };

  const clearDoneTasks = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('status', 'done')
        .eq('user_id', user.id);

      if (error) throw error;

      setTasks(tasks.filter((task) => task.status !== "done"));
      toast.success("Befejezett feladatok törölve!");
    } catch (error) {
      console.error('Error clearing done tasks:', error);
      toast.error('Hiba történt a befejezett feladatok törlésekor');
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

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