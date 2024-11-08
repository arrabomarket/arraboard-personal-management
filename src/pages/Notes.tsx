import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Note {
  id: string;
  title: string;
  content: string;
}

interface NoteFormData {
  title: string;
  content: string;
}

export default function Notes() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [formData, setFormData] = useState<NoteFormData>({ title: "", content: "" });
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const createNoteMutation = useMutation({
    mutationFn: async (note: NoteFormData) => {
      const { data, error } = await supabase
        .from("notes")
        .insert([note])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Jegyzet sikeresen létrehozva!");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Hiba történt a jegyzet létrehozása közben!");
    },
  });

  const updateNoteMutation = useMutation({
    mutationFn: async ({ id, ...note }: Note) => {
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Jegyzet sikeresen módosítva!");
      handleCloseDialog();
    },
    onError: () => {
      toast.error("Hiba történt a jegyzet módosítása közben!");
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Jegyzet sikeresen törölve!");
    },
    onError: () => {
      toast.error("Hiba történt a jegyzet törlése közben!");
    },
  });

  const handleOpenDialog = (note?: Note) => {
    if (note) {
      setEditingNote(note);
      setFormData({ title: note.title, content: note.content || "" });
    } else {
      setEditingNote(null);
      setFormData({ title: "", content: "" });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
    setFormData({ title: "", content: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("A jegyzet címe nem lehet üres!");
      return;
    }

    if (editingNote) {
      updateNoteMutation.mutate({ ...editingNote, ...formData });
    } else {
      createNoteMutation.mutate(formData);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Biztosan törölni szeretnéd ezt a jegyzetet?")) {
      deleteNoteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Jegyzetek</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="w-4 h-4 mr-2" />
          Új jegyzet
        </Button>
      </div>

      <div className="space-y-2">
        {notes.map((note, index) => (
          <div
            key={note.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              index % 2 === 0 ? "bg-[#13A3B5] text-white" : "bg-[#CDCDCD]"
            }`}
          >
            <span className="font-medium">{note.title}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleOpenDialog(note)}
                className={index % 2 === 0 ? "hover:bg-[#13A3B5]/90 text-white" : ""}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(note.id)}
                className={index % 2 === 0 ? "hover:bg-[#13A3B5]/90 text-white" : ""}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90%]">
          <DialogHeader>
            <DialogTitle>
              {editingNote ? "Jegyzet szerkesztése" : "Új jegyzet"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Jegyzet címe"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Jegyzet tartalma..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[250px]"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                {editingNote ? "Mentés" : "Létrehozás"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}