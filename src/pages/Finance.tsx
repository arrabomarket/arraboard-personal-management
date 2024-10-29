import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import FinanceTable from "@/components/finance/FinanceTable";
import { toast } from "sonner";

interface FinanceEntry {
  id: string;
  item: string;
  amount: number;
  date: Date;
  category: "Személyes" | "Munka" | "Extra";
  type: "Bevétel" | "Kiadás";
}

export default function Finance() {
  const [entries, setEntries] = useState<FinanceEntry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<FinanceEntry>>({
    date: new Date(),
    category: "Személyes",
    type: "Bevétel",
  });

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.item || !newEntry.amount) {
      toast.error("Kérjük, töltse ki az összes mezőt!");
      return;
    }

    const entry: FinanceEntry = {
      id: crypto.randomUUID(),
      item: newEntry.item!,
      amount: newEntry.amount!,
      date: newEntry.date!,
      category: newEntry.category!,
      type: newEntry.type!,
    };

    setEntries([...entries, entry]);
    setNewEntry({
      date: new Date(),
      category: "Személyes",
      type: "Bevétel",
    });
    toast.success("Tétel sikeresen hozzáadva!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pénzügy</h1>

      <form onSubmit={handleAddEntry} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Input
          placeholder="Tétel"
          value={newEntry.item || ""}
          onChange={(e) => setNewEntry({ ...newEntry, item: e.target.value })}
        />
        <Input
          type="number"
          placeholder="Összeg"
          value={newEntry.amount || ""}
          onChange={(e) => setNewEntry({ ...newEntry, amount: parseFloat(e.target.value) })}
        />
        <DatePicker
          date={newEntry.date}
          onDateChange={(date) => setNewEntry({ ...newEntry, date })}
        />
        <Select
          value={newEntry.category}
          onValueChange={(value) => setNewEntry({ ...newEntry, category: value as FinanceEntry['category'] })}
        >
          <option value="Személyes">Személyes</option>
          <option value="Munka">Munka</option>
          <option value="Extra">Extra</option>
        </Select>
        <Select
          value={newEntry.type}
          onValueChange={(value) => setNewEntry({ ...newEntry, type: value as FinanceEntry['type'] })}
        >
          <option value="Bevétel">Bevétel</option>
          <option value="Kiadás">Kiadás</option>
        </Select>
        <Button type="submit">Hozzáad</Button>
      </form>

      <FinanceTable entries={entries} />
    </div>
  );
}