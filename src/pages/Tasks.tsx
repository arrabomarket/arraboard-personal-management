import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import TaskCard from "@/components/tasks/TaskCard";
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

export default function Tasks() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [];
  });
  const [newCategory, setNewCategory] = useState("");

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      toast.error("A kategória neve nem lehet üres!");
      return;
    }
    
    const category: Category = {
      id: crypto.randomUUID(),
      name: newCategory,
      tasks: []
    };
    
    setCategories([...categories, category]);
    setNewCategory("");
    toast.success("Kategória sikeresen hozzáadva!");
  };

  const handleDeleteCategory = (categoryId: string) => {
    setCategories(categories.filter(cat => cat.id !== categoryId));
    toast.success("Kategória sikeresen törölve!");
  };

  const handleAddTask = (categoryId: string, taskTitle: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: [...category.tasks, { 
            id: crypto.randomUUID(),
            title: taskTitle,
            completed: false
          }]
        };
      }
      return category;
    }));
  };

  const handleToggleTask = (categoryId: string, taskId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          tasks: category.tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
          )
        };
      }
      return category;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tennivalók</h1>
      </div>

      <form onSubmit={handleAddCategory} className="flex gap-4">
        <Input
          placeholder="Új kategória neve..."
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Hozzáad
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <TaskCard
            key={category.id}
            category={category}
            onDelete={() => handleDeleteCategory(category.id)}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
          />
        ))}
      </div>
    </div>
  );
}