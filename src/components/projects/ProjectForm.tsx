import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

interface ProjectFormProps {
  onSubmit: (task: { title: string; status: string }) => void;
}

export default function ProjectForm({ onSubmit }: ProjectFormProps) {
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !status) {
      toast.error("Kérlek töltsd ki az összes mezőt!");
      return;
    }

    onSubmit({
      title: title.trim(),
      status,
    });

    setTitle("");
    setStatus("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Feladat neve"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Állapot" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Teendő</SelectItem>
            <SelectItem value="doing">Folyamatban</SelectItem>
            <SelectItem value="done">Kész</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Hozzáadás
      </Button>
    </form>
  );
}