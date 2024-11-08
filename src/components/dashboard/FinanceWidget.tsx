import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";

interface FinanceWidgetProps {
  monthlyIncome: number;
  monthlyExpenses: number;
}

export default function FinanceWidget({ monthlyIncome, monthlyExpenses }: FinanceWidgetProps) {
  return (
    <Card className="md:col-span-2 bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Havi pénzügyek</CardTitle>
        <Wallet className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between">
          <span>Bevétel:</span>
          <span className="text-green-600">+{monthlyIncome.toLocaleString('hu-HU')} Ft</span>
        </div>
        <div className="flex justify-between">
          <span>Kiadás:</span>
          <span className="text-red-600">-{monthlyExpenses.toLocaleString('hu-HU')} Ft</span>
        </div>
      </CardContent>
    </Card>
  );
}