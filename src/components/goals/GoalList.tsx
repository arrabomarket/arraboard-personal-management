import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface Desire {
  id: string;
  title: string;
  price: number;
  priority: string;
}

interface DesireListProps {
  desires: Desire[];
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

export default function DesireList({ desires, onDelete }: DesireListProps) {
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
          {desires.map((desire) => (
            <TableRow key={desire.id}>
              <TableCell>{desire.title}</TableCell>
              <TableCell>{desire.price.toLocaleString('hu-HU')} Ft</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${getPriorityColor(desire.priority)}`}>
                  {desire.priority}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(desire.id)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}