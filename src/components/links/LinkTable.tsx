import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";

interface Link {
  id: string;
  name: string;
  url: string;
  category: string;
}

interface LinkTableProps {
  links: Link[];
  onEdit: (link: Link) => void;
  onDelete: (id: string) => void;
}

export default function LinkTable({ links, onEdit, onDelete }: LinkTableProps) {
  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Link neve</TableHead>
            <TableHead>Hivatkozás</TableHead>
            <TableHead>Kategória</TableHead>
            <TableHead className="w-[100px]">Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">{link.name}</TableCell>
              <TableCell>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </TableCell>
              <TableCell>{link.category}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(link)}
                  >
                    <Pencil className="h-4 w-4 text-primary" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(link.id)}
                  >
                    <Trash2 className="h-4 w-4 text-[#222222]" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {links.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                Nincs találat
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
