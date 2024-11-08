import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";

interface NoteFormProps {
  initialData?: {
    title: string;
    content: string;
  };
  onSubmit: (data: { title: string; content: string }) => void;
}

export function NoteForm({ initialData, onSubmit }: NoteFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Jegyzet címe"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="bg-[#2C2C2C] border-gray-800 text-white placeholder:text-gray-400"
        />
      </div>
      <div className="space-y-2">
        <Textarea
          placeholder="Jegyzet tartalma..."
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          className="min-h-[250px] bg-[#2C2C2C] border-gray-800 text-white placeholder:text-gray-400"
        />
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-[#3ECF8E] hover:bg-[#3ECF8E]/90">
          Mentés
        </Button>
      </DialogFooter>
    </form>
  );
}