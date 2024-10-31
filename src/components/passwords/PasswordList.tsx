import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Pencil, Search, Trash2 } from "lucide-react";
import { useState } from "react";

interface Password {
  id: string;
  name: string;
  url: string;
  password: string;
}

interface PasswordListProps {
  passwords: Password[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onEdit: (password: Password) => void;
  onDelete: (id: string) => void;
}

export default function PasswordList({
  passwords,
  searchTerm,
  onSearchChange,
  onEdit,
  onDelete,
}: PasswordListProps) {
  const [selectedPassword, setSelectedPassword] = useState<Password | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Jelszavak listája</h2>
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Keresés..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Oldal neve</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Jelszó</TableHead>
              <TableHead className="w-[100px]">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passwords.map((password) => (
              <TableRow key={password.id}>
                <TableCell className="font-medium">{password.name}</TableCell>
                <TableCell>
                  <a href={password.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {password.url}
                  </a>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span>••••••••</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedPassword(password)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(password)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(password.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {passwords.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Nincs találat
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedPassword} onOpenChange={() => setSelectedPassword(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedPassword?.name} jelszava</DialogTitle>
          </DialogHeader>
          <div className="p-4 text-center text-lg">
            {selectedPassword?.password}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}