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
import TransactionTable from "@/components/finance/TransactionTable";
import { format, startOfMonth, endOfMonth, parse } from "date-fns";
import { hu } from "date-fns/locale";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, TransactionCategory, TransactionType } from "@/types/finance";

export default function Finance() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [category, setCategory] = useState<TransactionCategory>("personal");
  const [type, setType] = useState<TransactionType>("expense");
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<TransactionCategory | "all">("all");
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const user = useAuth();

  useEffect(() => {
    if (!user.user) return;
    loadTransactions();
  }, [user.user]);

  const loadTransactions = async () => {
    if (!user.user) return;
    
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.user.id);
    
    if (error) {
      toast.error("Hiba történt az adatok betöltésekor");
      return;
    }

    if (data) {
      setTransactions(data.map(t => ({
        ...t,
        date: new Date(t.date),
        category: t.category as TransactionCategory,
        type: t.type as TransactionType
      })));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !amount || !date || !user.user) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    const transactionData = {
      title: title.trim(),
      amount: Number(amount),
      date: date.toISOString(),
      category,
      type,
      user_id: user.user.id,
      ...(editingTransaction && { id: editingTransaction.id })
    };

    const { error } = editingTransaction
      ? await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', editingTransaction.id)
      : await supabase
          .from('transactions')
          .insert(transactionData);

    if (error) {
      toast.error("Hiba történt a mentés során");
      return;
    }

    setTitle("");
    setAmount("");
    setDate(new Date());
    setCategory("personal");
    setType("expense");
    setEditingTransaction(null);
    loadTransactions();
    toast.success(editingTransaction ? "Tétel sikeresen módosítva!" : "Tétel sikeresen hozzáadva!");
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setTitle(transaction.title);
    setAmount(transaction.amount.toString());
    setDate(new Date(transaction.date));
    setCategory(transaction.category as TransactionCategory);
    setType(transaction.type as TransactionType);
  };

  const handleDelete = async (id: string) => {
    if (!user.user) return;

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Hiba történt a törlés során");
      return;
    }

    loadTransactions();
    toast.success("Tétel sikeresen törölve!");
  };

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
        <div className="flex gap-2">
          {editingTransaction && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingTransaction(null);
                setTitle("");
                setAmount("");
                setDate(new Date());
                setCategory("personal");
                setType("expense");
              }}
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
        <TransactionTable 
          transactions={filteredTransactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}