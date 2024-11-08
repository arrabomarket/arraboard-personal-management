import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  price: number;
  priority: string;
}

interface GoalListProps {
  goals: Goal[];
  onEdit: (goal: Goal) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case "magas":
      return "bg-[#13a3b5] text-white";
    case "közepes":
      return "bg-[#ffde59]";
    case "alacsony":
      return "bg-[#d9d9d9]";
    default:
      return "";
  }
};

export default function GoalList({ goals, onEdit, onDelete }: GoalListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Termék</TableHead>
            <TableHead>Termék ára</TableHead>
            <TableHead>Prioritás</TableHead>
            <TableHead className="text-right">Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <TableRow key={goal.id}>
              <TableCell>{goal.title}</TableCell>
              <TableCell>{goal.price.toLocaleString('hu-HU')} Ft</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(goal.priority)}`}>
                  {goal.priority}
                </span>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(goal)}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(goal.id)}
                >
                  <Trash2 className="h-4 w-4 text-[#222222]" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}