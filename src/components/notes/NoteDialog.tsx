import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteDialogProps {
  note: Note;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (noteId: string, content: string) => void;
}

export default function NoteDialog({
  note,
  open,
  onOpenChange,
  onUpdate,
}: NoteDialogProps) {
  const [content, setContent] = useState(note.content);

  useEffect(() => {
    setContent(note.content);
  }, [note.content]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(note.id, content);
    toast.success("Jegyzet sikeresen mentve!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{note.title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="Írja ide a jegyzet tartalmát..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px]"
          />
          <div className="flex justify-end">
            <Button type="submit">Mentés</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}