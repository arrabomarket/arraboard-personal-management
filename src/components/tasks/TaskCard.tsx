import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import TaskDialog from "./TaskDialog";
import { useState } from "react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Category {
  id: string;
  name: string;
  tasks: Task[];
}

interface TaskCardProps {
  category: Category;
  onDelete: () => void;
  onAddTask: (categoryId: string, taskTitle: string) => void;
  onToggleTask: (categoryId: string, taskId: string) => void;
}

export default function TaskCard({ category, onDelete, onAddTask, onToggleTask }: TaskCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const completedTasks = category.tasks.filter(task => task.completed).length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{category.name}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDialogOpen(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {completedTasks}/{category.tasks.length} elvégzett tennivaló
        </p>
      </CardContent>
      <TaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        category={category}
        onAddTask={onAddTask}
        onToggleTask={onToggleTask}
      />
    </Card>
  );
}