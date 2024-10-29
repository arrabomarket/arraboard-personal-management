import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Transaction, TransactionCategory, TransactionType } from "@/types/finance";
import TransactionCard from "@/components/finance/TransactionCard";
import TransactionTable from "@/components/finance/TransactionTable";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<TransactionCategory>("personal");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "all">("all");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !amount || !date) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: Number(amount),
      date,
      category,
      type,
    };

    setTransactions([...transactions, newTransaction]);
    setTitle("");
    setAmount("");
    setDate(new Date());
    setCategory("personal");
    setType("expense");
    toast.success("Tétel sikeresen hozzáadva!");
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const isInSelectedMonth = 
      transaction.date >= startOfMonth(selectedMonth) &&
      transaction.date <= endOfMonth(selectedMonth);
    
    const matchesCategory = 
      selectedCategory === "all" || transaction.category === selectedCategory;

    return isInSelectedMonth && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pénzügy</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Input
            placeholder="Tétel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Összeg"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "yyyy.MM.dd") : "Dátum kiválasztása"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Kategória" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Személyes</SelectItem>
              <SelectItem value="work">Munka</SelectItem>
              <SelectItem value="extra">Extra</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Jelleg" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Bevétel</SelectItem>
              <SelectItem value="expense">Kiadás</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit">Hozzáadás</Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tranzakciók</h2>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(selectedMonth, "yyyy. MMMM")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedMonth}
                  onSelect={(date) => date && setSelectedMonth(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Select 
              value={selectedCategory} 
              onValueChange={(value) => setSelectedCategory(value as TransactionCategory | "all")}
            >
              <SelectTrigger className="bg-white">
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
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}