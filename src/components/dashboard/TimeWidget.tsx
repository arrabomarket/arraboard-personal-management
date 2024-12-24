import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";

interface TimeWidgetProps {
  currentTime: Date;
}

export default function TimeWidget({ currentTime }: TimeWidgetProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pontos idő</CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{format(currentTime, "HH:mm:ss")}</div>
        <p className="text-xs text-muted-foreground">
          {format(currentTime, "yyyy. MMMM d., EEEE")}
        </p>
      </CardContent>
    </Card>
  );
}