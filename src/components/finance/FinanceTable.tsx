import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select } from "@/components/ui/select";
import { format } from "date-fns";
import { hu } from "date-fns/locale";

interface FinanceEntry {
  id: string;
  item: string;
  amount: number;
  date: Date;
  category: "Személyes" | "Munka" | "Extra";
  type: "Bevétel" | "Kiadás";
}

interface FinanceTableProps {
  entries: FinanceEntry[];
}

export default function FinanceTable({ entries }: FinanceTableProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy-MM"));
  const [selectedCategory, setSelectedCategory] = useState<string>("Összes");

  const filteredEntries = entries.filter((entry) => {
    const entryMonth = format(entry.date, "yyyy-MM");
    return (
      entryMonth === selectedMonth &&
      (selectedCategory === "Összes" || entry.category === selectedCategory)
    );
  });

  const months = Array.from(new Set(entries.map((entry) => format(entry.date, "yyyy-MM")))).sort().reverse();

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-4">
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {format(new Date(month), "yyyy MMMM", { locale: hu })}
            </option>
          ))}
        </Select>
        <Select
          value={selectedCategory}
          onValueChange={setSelectedCategory}
        >
          <option value="Összes">Összes kategória</option>
          <option value="Személyes">Személyes</option>
          <option value="Munka">Munka</option>
          <option value="Extra">Extra</option>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Dátum</TableHead>
            <TableHead>Tétel</TableHead>
            <TableHead>Kategória</TableHead>
            <TableHead>Típus</TableHead>
            <TableHead className="text-right">Összeg</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEntries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>{format(entry.date, "yyyy.MM.dd")}</TableCell>
              <TableCell>{entry.item}</TableCell>
              <TableCell>{entry.category}</TableCell>
              <TableCell>{entry.type}</TableCell>
              <TableCell className="text-right">{entry.amount.toLocaleString()} Ft</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}