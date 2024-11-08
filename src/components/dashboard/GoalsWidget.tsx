import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

interface GoalsWidgetProps {
  goals: any[];
}

export default function GoalsWidget({ goals }: GoalsWidgetProps) {
  return (
    <Card className="bg-[#13A3B5] text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Fő Célok</CardTitle>
        <Target className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {!goals || goals.length === 0 ? (
            <p className="text-white/70">Nincs magas prioritású cél</p>
          ) : (
            goals.map((goal) => (
              <div key={goal.id} className="flex items-center justify-between rounded-lg border border-white/20 p-2">
                <span>{goal.title}</span>
                <span>{goal.price.toLocaleString('hu-HU')} Ft</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}