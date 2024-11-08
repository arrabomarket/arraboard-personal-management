import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListCheck } from "lucide-react";

interface TasksWidgetProps {
  tasks: any[];
}

export default function TasksWidget({ tasks }: TasksWidgetProps) {
  return (
    <Card className="bg-black text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mai tennivalók</CardTitle>
        <ListCheck className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-white/70">Nincs mai tennivaló</p>
          ) : (
            tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between rounded-lg border border-white/20 p-2">
                <span>{task.title}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}