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

interface TransactionTableProps {
  transactions: Transaction[];
}

export default function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Tétel</TableHead>
          <TableHead>Összeg</TableHead>
          <TableHead>Dátum</TableHead>
          <TableHead>Kategória</TableHead>
          <TableHead>Jelleg</TableHead>
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
            <TableCell className="capitalize">{transaction.category}</TableCell>
            <TableCell className="capitalize">
              {transaction.type === 'income' ? 'Bevétel' : 'Kiadás'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}