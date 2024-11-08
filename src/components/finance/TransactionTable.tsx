import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Transaction } from "@/types/finance";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionTableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

export default function TransactionTable({ transactions, onEdit, onDelete }: TransactionTableProps) {
  const getCategoryLabel = (category: string) => {
    switch(category) {
      case "personal": return "Személyes";
      case "work": return "Munka";
      case "extra": return "Extra";
      default: return category;
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tétel</TableHead>
          <TableHead>Összeg</TableHead>
          <TableHead>Dátum</TableHead>
          <TableHead>Kategória</TableHead>
          <TableHead>Jelleg</TableHead>
          <TableHead className="text-right">Műveletek</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>{transaction.title}</TableCell>
            <TableCell className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
              {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString('hu-HU')} Ft
            </TableCell>
            <TableCell>{format(transaction.date, 'yyyy.MM.dd')}</TableCell>
            <TableCell className="capitalize">{getCategoryLabel(transaction.category)}</TableCell>
            <TableCell className="capitalize">
              {transaction.type === 'income' ? 'Bevétel' : 'Kiadás'}
            </TableCell>
            <TableCell className="text-right space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(transaction)}
              >
                <Pencil className="h-4 w-4 text-primary" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4 text-primary" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}