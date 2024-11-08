import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteListProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteList({ notes, onEdit, onDelete }: NoteListProps) {
  return (
    <div className="space-y-1.5 bg-white border border-[#DFDFDF] rounded-lg p-4">
      {notes.map((note) => (
        <div
          key={note.id}
          className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-[#DFDFDF]"
        >
          <span className="font-medium text-gray-900">{note.title}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(note)}
              className="hover:bg-gray-100"
            >
              <Pencil className="h-4 w-4 text-gray-700" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
              className="hover:bg-gray-100"
            >
              <Trash2 className="h-4 w-4 text-gray-700" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}