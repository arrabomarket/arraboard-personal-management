import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit2, Trash2 } from "lucide-react";
import NoteDialog from "./NoteDialog";
import { useState } from "react";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteCardProps {
  note: Note;
  onDelete: () => void;
  onUpdate: (noteId: string, content: string) => void;
}

export default function NoteCard({ note, onDelete, onUpdate }: NoteCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{note.title}</CardTitle>
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
      <NoteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        note={note}
        onUpdate={onUpdate}
      />
    </Card>
  );
}