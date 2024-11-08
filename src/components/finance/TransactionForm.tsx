import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Transaction, TransactionCategory, TransactionType } from "@/types/finance";

interface TransactionFormProps {
  title: string;
  amount: string;
  date: Date;
  category: TransactionCategory;
  type: TransactionType;
  editingTransaction: Transaction | null;
  onSubmit: (e: React.FormEvent) => void;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (value: Date) => void;
  onCategoryChange: (value: TransactionCategory) => void;
  onTypeChange: (value: TransactionType) => void;
  onCancel: () => void;
}

export default function TransactionForm({
  title,
  amount,
  date,
  category,
  type,
  editingTransaction,
  onSubmit,
  onTitleChange,
  onAmountChange,
  onDateChange,
  onCategoryChange,
  onTypeChange,
  onCancel,
}: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Input
          placeholder="Tétel"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Összeg"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
        />
        <Input
          type="date"
          value={format(date, "yyyy-MM-dd")}
          onChange={(e) => onDateChange(new Date(e.target.value))}
        />
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Kategória" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="personal">Személyes</SelectItem>
            <SelectItem value="work">Munka</SelectItem>
            <SelectItem value="extra">Extra</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={onTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Jelleg" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Bevétel</SelectItem>
            <SelectItem value="expense">Kiadás</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2">
        {editingTransaction && (
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
          {editingTransaction ? "Mentés" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  );
}