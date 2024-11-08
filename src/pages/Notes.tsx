import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { NoteForm } from "@/components/notes/NoteForm";
import { NoteList } from "@/components/notes/NoteList";
import { useAuth } from "@/lib/auth";

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
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const createNoteMutation = useMutation({
    mutationFn: async (note: NoteFormData) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("notes")
        .insert([{ ...note, user_id: user.id }])
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
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from("notes")
        .update(note)
        .eq("id", id)
        .eq("user_id", user.id)
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
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);
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
    } else {
      setEditingNote(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingNote(null);
  };

  const handleSubmit = (formData: NoteFormData) => {
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
    <div className="space-y-6 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between py-4 border-b border-gray-800/10">
        <h1 className="text-2xl font-bold tracking-tight">Jegyzetek</h1>
        <Button onClick={() => handleOpenDialog()} variant="default" className="bg-[#3ECF8E] hover:bg-[#3ECF8E]/90">
          <Plus className="w-4 h-4 mr-2" />
          Új jegyzet
        </Button>
      </div>

      <div className="bg-gradient-to-b from-gray-900/5 to-transparent p-6 rounded-lg border border-gray-800/10">
        <NoteList
          notes={notes}
          onEdit={handleOpenDialog}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90%] bg-[#1C1C1C] text-white border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {editingNote ? "Jegyzet szerkesztése" : "Új jegyzet"}
            </DialogTitle>
          </DialogHeader>
          <NoteForm
            initialData={editingNote || undefined}
            onSubmit={handleSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}