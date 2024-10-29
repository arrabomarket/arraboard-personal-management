import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import NoteCard from "@/components/notes/NoteCard";
import { toast } from "sonner";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [newNoteTitle, setNewNoteTitle] = useState("");

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) {
      toast.error("A jegyzet címe nem lehet üres!");
      return;
    }
    
    const note: Note = {
      id: crypto.randomUUID(),
      title: newNoteTitle,
      content: ""
    };
    
    setNotes([...notes, note]);
    setNewNoteTitle("");
    toast.success("Jegyzet sikeresen hozzáadva!");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    toast.success("Jegyzet sikeresen törölve!");
  };

  const handleUpdateNote = (noteId: string, content: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, content } : note
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jegyzetek</h1>
      </div>

      <form onSubmit={handleAddNote} className="flex gap-4">
        <Input
          placeholder="Új jegyzet címe..."
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
          className="max-w-sm"
        />
        <Button type="submit">
          <Plus className="w-4 h-4 mr-2" />
          Hozzáad
        </Button>
      </form>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={() => handleDeleteNote(note.id)}
            onUpdate={handleUpdateNote}
          />
        ))}
      </div>
    </div>
  );
}