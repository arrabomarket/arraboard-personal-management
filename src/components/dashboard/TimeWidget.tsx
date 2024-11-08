import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { hu } from "date-fns/locale";

interface TimeWidgetProps {
  currentTime: Date;
}

export default function TimeWidget({ currentTime }: TimeWidgetProps) {
  return (
    <Card className="md:col-span-1 bg-[#13A3B5] text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Pontos idő</CardTitle>
        <Clock className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {format(currentTime, "HH:mm:ss")}
        </div>
        <div className="text-xl mt-2">
          {format(currentTime, "yyyy. MMMM d.", { locale: hu })}
        </div>
      </CardContent>
    </Card>
  );
}