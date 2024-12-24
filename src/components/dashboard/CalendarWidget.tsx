import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";

interface CalendarWidgetProps {
  tasks: any[];
}

export default function CalendarWidget({ tasks }: CalendarWidgetProps) {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mai teendők</CardTitle>
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-muted-foreground">Nincs mai tennivaló</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 rounded-lg border bg-gray-50">
                <span>{task.title}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}