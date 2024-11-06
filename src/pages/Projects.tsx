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
  user_id: string;
  created_at: string;
}

export default function Projects() {
  const queryClient = useQueryClient();
  const [editingTask, setEditingTask] = useState<ProjectTask | null>(null);

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["project-tasks"],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("project_tasks")
        .select("*")
        .eq("user_id", user.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as ProjectTask[];
    },
  });

  // Add task
  const addTask = useMutation({
    mutationFn: async (newTask: { title: string; status: "todo" | "doing" | "done" }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase.from("project_tasks").insert([{
        ...newTask,
        user_id: user.user.id,
      }]);
      
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
    mutationFn: async (task: { title: string; status: "todo" | "doing" | "done"; id: string }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("project_tasks")
        .update({ 
          title: task.title, 
          status: task.status,
        })
        .eq("id", task.id)
        .eq("user_id", user.user.id);

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
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("project_tasks")
        .delete()
        .eq("id", id)
        .eq("user_id", user.user.id);

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

  const handleSubmit = (task: { title: string; status: "todo" | "doing" | "done" }) => {
    if (editingTask) {
      updateTask.mutate({ ...task, id: editingTask.id });
    } else {
      addTask.mutate(task);
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Projektek</h1>
      
      <ProjectForm
        onSubmit={handleSubmit}
        initialData={editingTask}
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