import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import KanbanBoard from "@/components/projects/KanbanBoard";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [newProjectTitle, setNewProjectTitle] = useState("");

  // Load projects and tasks from localStorage on component mount
  useEffect(() => {
    const savedProjects = localStorage.getItem("projects");
    const savedTasks = localStorage.getItem("projectTasks");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  }, []);

  // Save projects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) {
      toast.error("A projekt neve nem lehet üres!");
      return;
    }
    
    const project: Project = {
      id: crypto.randomUUID(),
      title: newProjectTitle.trim(),
    };
    
    setProjects([...projects, project]);
    setNewProjectTitle("");
    toast.success("Projekt sikeresen hozzáadva!");
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(projects.filter(project => project.id !== projectId));
    // Töröljük a projekthez tartozó feladatokat is
    const savedTasks = JSON.parse(localStorage.getItem("projectTasks") || "{}");
    delete savedTasks[projectId];
    localStorage.setItem("projectTasks", JSON.stringify(savedTasks));
    toast.success("Projekt sikeresen törölve!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projektek</h1>
      </div>

      <form onSubmit={handleAddProject} className="flex gap-4">
        <Input
          placeholder="Új projekt neve..."
          value={newProjectTitle}
          onChange={(e) => setNewProjectTitle(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Hozzáad
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <KanbanBoard
            key={project.id}
            id={project.id}
            title={project.title}
            onDelete={handleDeleteProject}
          />
        ))}
      </div>
    </div>
  );
}