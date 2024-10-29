import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/types/finance";
import { format } from "date-fns";

interface TransactionCardProps {
  transaction: Transaction;
}

export default function TransactionCard({ transaction }: TransactionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{transaction.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Összeg:</span>
            <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
              {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString('hu-HU')} Ft
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Dátum:</span>
            <span>{format(transaction.date, 'yyyy.MM.dd')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Kategória:</span>
            <span className="capitalize">{transaction.category}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Jelleg:</span>
            <span className="capitalize">{transaction.type === 'income' ? 'Bevétel' : 'Kiadás'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}