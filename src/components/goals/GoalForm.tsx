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

interface Goal {
  id: string;
  title: string;
  price: number;
  priority: string;
}

interface GoalFormProps {
  goal: Goal | null;
  onSubmit: (goal: Omit<Goal, "id">) => void;
  onCancel?: () => void;
}

export default function GoalForm({ goal, onSubmit, onCancel }: GoalFormProps) {
  const [title, setTitle] = useState(goal?.title || "");
  const [price, setPrice] = useState(goal?.price?.toString() || "");
  const [priority, setPriority] = useState(goal?.priority || "");

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

    if (!goal) {
      setTitle("");
      setPrice("");
      setPriority("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">
            Termék neve *
          </label>
          <Input
            id="title"
            placeholder="Termék neve"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-gray-700">
            Termék ára (Ft) *
          </label>
          <Input
            id="price"
            type="number"
            placeholder="Termék ára"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium text-gray-700">
            Prioritás *
          </label>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger id="priority">
              <SelectValue placeholder="Válassz prioritást" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="magas">Magas</SelectItem>
              <SelectItem value="közepes">Közepes</SelectItem>
              <SelectItem value="alacsony">Alacsony</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex gap-2">
        {goal && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Mégse
          </Button>
        )}
        <Button type="submit" className="w-full">
          {goal ? "Mentés" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  );
}