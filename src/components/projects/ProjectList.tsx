import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface ProjectTask {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  user_id: string;
  created_at: string;
}

interface ProjectListProps {
  tasks: ProjectTask[];
  onEdit: (task: ProjectTask) => void;
  onDelete: (id: string) => void;
}

export default function ProjectList({ tasks, onEdit, onDelete }: ProjectListProps) {
  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feladat neve</TableHead>
              <TableHead>Állapot</TableHead>
              <TableHead className="w-[100px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      task.status === "todo"
                        ? "bg-gray-100"
                        : task.status === "doing"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {task.status === "todo"
                      ? "Teendő"
                      : task.status === "doing"
                      ? "Folyamatban"
                      : "Kész"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {tasks.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8">
                  Nincs feladat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}