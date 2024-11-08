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
      {notes.map((note, index) => (
        <div
          key={note.id}
          className={`flex items-center justify-between p-2.5 rounded-lg ${
            index % 2 === 0 ? "bg-[#13A3B5] text-white" : "bg-[#CDCDCD]"
          }`}
        >
          <span className="font-medium">{note.title}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(note)}
              className={index % 2 === 0 ? "hover:bg-[#13A3B5]/90 text-white" : ""}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(note.id)}
              className={index % 2 === 0 ? "hover:bg-[#13A3B5]/90 text-white" : ""}
            >
              <Trash2 className="h-4 w-4 text-[#222222]" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}