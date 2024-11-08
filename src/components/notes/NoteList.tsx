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
    <div className="space-y-1">
      {notes.map((note, index) => (
        <div
          key={note.id}
          className={`flex items-center justify-between p-2 rounded-md border border-gray-800/10 hover:border-gray-800/30 transition-colors ${
            index % 2 === 0 ? "bg-[#1C1C1C] text-white" : "bg-[#2C2C2C] text-gray-100"
          }`}
        >
          <span className="font-medium text-sm">{note.title}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(note)}
              className="h-8 w-8 hover:bg-gray-800/20"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
              className="h-8 w-8 hover:bg-gray-800/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}