import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import KanbanItem from "./KanbanItem";

interface Task {
  id: string;
  content: string;
  status: string;
}

interface KanbanColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  showClearButton?: boolean;
  onClear?: () => void;
}

export default function KanbanColumn({
  id,
  title,
  tasks,
  showClearButton,
  onClear,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <Card className="h-[calc(100vh-16rem)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
        {showClearButton && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-8 w-8 text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div
          ref={setNodeRef}
          className="h-full space-y-2 overflow-y-auto"
        >
          <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanItem key={task.id} id={task.id} content={task.content} />
            ))}
          </SortableContext>
        </div>
      </CardContent>
    </Card>
  );
}