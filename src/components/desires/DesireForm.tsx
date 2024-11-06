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

interface DesireFormProps {
  onSubmit: (desire: { title: string; price: number; priority: string }) => void;
}

export default function DesireForm({ onSubmit }: DesireFormProps) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [priority, setPriority] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price || !priority) {
      toast.error("Kérlek tölts ki minden mezőt!");
      return;
    }

    onSubmit({
      title: title.trim(),
      price: Number(price),
      priority,
    });

    setTitle("");
    setPrice("");
    setPriority("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          placeholder="Termék neve"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Termék ára"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue placeholder="Prioritás" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="magas">Magas</SelectItem>
            <SelectItem value="közepes">Közepes</SelectItem>
            <SelectItem value="alacsony">Alacsony</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Hozzáadás
      </Button>
    </form>
  );
}