import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProjectList from "@/components/projects/ProjectList";
import ProjectForm from "@/components/projects/ProjectForm";
import { toast } from "sonner";

interface ProjectTask {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
}

export default function Projects() {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Add task
  const addTask = useMutation({
    mutationFn: async (newTask: { title: string; status: string }) => {
      const { error } = await supabase.from("project_tasks").insert([newTask]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast.success("Feladat sikeresen hozzáadva!");
    },
    onError: () => {
      toast.error("Hiba történt a feladat hozzáadása közben!");
    },
  });

  // Update task
  const updateTask = useMutation({
    mutationFn: async (task: ProjectTask) => {
      const { error } = await supabase
        .from("project_tasks")
        .update({ title: task.title, status: task.status })
        .eq("id", task.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      setEditingTask(null);
      toast.success("Feladat sikeresen módosítva!");
    },
    onError: () => {
      toast.error("Hiba történt a feladat módosítása közben!");
    },
  });

  // Delete task
  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-tasks"] });
      toast.success("Feladat sikeresen törölve!");
    },
    onError: () => {
      toast.error("Hiba történt a feladat törlése közben!");
    },
  });

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Projektek</h1>
      
      <ProjectForm
        onSubmit={(task) => {
          if (editingTask) {
            updateTask.mutate({ ...task, id: editingTask.id } as ProjectTask);
          } else {
            addTask.mutate(task);
          }
        }}
      />
      
      <ProjectList
        tasks={tasks}
        onEdit={setEditingTask}
        onDelete={(id) => {
          if (window.confirm("Biztosan törölni szeretnéd ezt a feladatot?")) {
            deleteTask.mutate(id);
          }
        }}
      />
    </div>
  );
}