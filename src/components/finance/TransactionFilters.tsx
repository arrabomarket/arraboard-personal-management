import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse } from "date-fns";
import { hu } from "date-fns/locale";
import { TransactionCategory } from "@/types/finance";

interface TransactionFiltersProps {
  selectedMonth: Date;
  selectedCategory: TransactionCategory | "all";
  availableMonths: Array<{ value: string; label: string }>;
  onMonthChange: (value: Date) => void;
  onCategoryChange: (value: TransactionCategory | "all") => void;
}

export default function TransactionFilters({
  selectedMonth,
  selectedCategory,
  availableMonths,
  onMonthChange,
  onCategoryChange,
}: TransactionFiltersProps) {
  return (
    <div className="flex gap-4">
      <Select 
        value={format(selectedMonth, "yyyy-MM")}
        onValueChange={(value) => onMonthChange(parse(value, "yyyy-MM", new Date()))}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Válasszon hónapot" />
        </SelectTrigger>
        <SelectContent>
          {availableMonths.map((month) => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select 
        value={selectedCategory} 
        onValueChange={(value) => onCategoryChange(value as TransactionCategory | "all")}
      >
        <SelectTrigger>
          <SelectValue placeholder="Kategória" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Összes</SelectItem>
          <SelectItem value="personal">Személyes</SelectItem>
          <SelectItem value="work">Munka</SelectItem>
          <SelectItem value="extra">Extra</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}