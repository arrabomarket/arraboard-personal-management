import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProjectTask {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  user_id: string;
  created_at: string;
}

interface ProjectFormProps {
  onSubmit: (task: { title: string; status: "todo" | "doing" | "done" }) => void;
  initialData?: ProjectTask | null;
}

export default function ProjectForm({ onSubmit, initialData }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"todo" | "doing" | "done">("todo");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setStatus(initialData.status);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, status });
    if (!initialData) {
      setTitle("");
      setStatus("todo");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Input
          placeholder="Feladat neve"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <Select value={status} onValueChange={(value: "todo" | "doing" | "done") => setStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Válassz státuszt" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Teendő</SelectItem>
            <SelectItem value="doing">Folyamatban</SelectItem>
            <SelectItem value="done">Kész</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit">
        {initialData ? "Módosítás" : "Hozzáadás"}
      </Button>
    </form>
  );
}