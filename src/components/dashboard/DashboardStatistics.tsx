import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardStatisticsProps {
  monthlyIncome: number;
  monthlyExpenses: number;
}

export default function DashboardStatistics({ monthlyIncome, monthlyExpenses }: DashboardStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Pénzügyi áttekintés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Havi bevétel:</span>
              <span className="text-green-600">+{monthlyIncome.toLocaleString('hu-HU')} Ft</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Havi kiadás:</span>
              <span className="text-red-600">-{monthlyExpenses.toLocaleString('hu-HU')} Ft</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Feladatok állapota</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-muted-foreground">Nincs megjeleníthető statisztika</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}