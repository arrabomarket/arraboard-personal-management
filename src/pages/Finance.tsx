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
import { Transaction, TransactionCategory, TransactionType } from "@/types/finance";
import TransactionTable from "@/components/finance/TransactionTable";
import { format, startOfMonth, endOfMonth, parse } from "date-fns";
import { hu } from "date-fns/locale";
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

  // Egyedi hónapok kiszűrése a tranzakciókból
  const availableMonths = Array.from(
    new Set(
      transactions.map((t) => format(t.date, "yyyy-MM"))
    )
  ).map((monthStr) => {
    const date = parse(monthStr, "yyyy-MM", new Date());
    return {
      value: monthStr,
      label: format(date, "yyyy. MMMM", { locale: hu })
    };
  }).sort((a, b) => a.value.localeCompare(b.value));

  useEffect(() => {
    const savedTransactions = localStorage.getItem("transactions");
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      }));
    }
  }, []);

  // Mentjük a tranzakciókat amikor változnak
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

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

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      value: format(date, "yyyy-MM"),
      label: format(date, "yyyy. MMMM", { locale: hu })
    };
  });

  const filteredTransactions = transactions.filter((transaction) => {
    const isInSelectedMonth = 
      transaction.date >= startOfMonth(selectedMonth) &&
      transaction.date <= endOfMonth(selectedMonth);
    
    const matchesCategory = 
      selectedCategory === "all" || transaction.category === selectedCategory;

    return isInSelectedMonth && matchesCategory;
  });

  const getCategoryLabel = (category: TransactionCategory) => {
    switch(category) {
      case "personal": return "Személyes";
      case "work": return "Munka";
      case "extra": return "Extra";
      default: return category;
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pénzügy</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
          <Input
            type="date"
            value={format(date, "yyyy-MM-dd")}
            onChange={(e) => setDate(new Date(e.target.value))}
          />
          <Select value={category} onValueChange={(value) => setCategory(value as TransactionCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Kategória" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal">Személyes</SelectItem>
              <SelectItem value="work">Munka</SelectItem>
              <SelectItem value="extra">Extra</SelectItem>
            </SelectContent>
          </Select>
          <Select value={type} onValueChange={(value) => setType(value as TransactionType)}>
            <SelectTrigger>
              <SelectValue placeholder="Jelleg" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="income">Bevétel</SelectItem>
              <SelectItem value="expense">Kiadás</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Hozzáadás</Button>
      </form>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Tranzakciók</h2>
          <div className="flex gap-4">
            <Select 
              value={format(selectedMonth, "yyyy-MM")}
              onValueChange={(value) => setSelectedMonth(parse(value, "yyyy-MM", new Date()))}
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
              onValueChange={(value) => setSelectedCategory(value as TransactionCategory | "all")}
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
        </div>
        <TransactionTable transactions={filteredTransactions} />
      </div>
    </div>
  );
}
