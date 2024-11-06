import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DesireForm from "@/components/desires/DesireForm";
import DesireList from "@/components/desires/DesireList";

interface Desire {
  id: string;
  title: string;
  price: number;
  priority: string;
}

export default function Desires() {
  const queryClient = useQueryClient();

  const { data: desires, isLoading } = useQuery({
    queryKey: ["desires"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("desires")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (desireData: Omit<Desire, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nincs bejelentkezett felhasználó!");
        return;
      }

      const { error } = await supabase.from("desires").insert({
        title: desireData.title,
        price: desireData.price,
        priority: desireData.priority,
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Vágy sikeresen hozzáadva!");
      queryClient.invalidateQueries({ queryKey: ["desires"] });
    } catch (error) {
      console.error("Error adding desire:", error);
      toast.error("Hiba történt a vágy hozzáadásakor");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("desires")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Vágy sikeresen törölve!");
      queryClient.invalidateQueries({ queryKey: ["desires"] });
    } catch (error) {
      console.error("Error deleting desire:", error);
      toast.error("Hiba történt a vágy törlésekor");
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Vágyak</h1>
      </div>

      <DesireForm onSubmit={handleSubmit} />
      <DesireList desires={desires || []} onDelete={handleDelete} />
    </div>
  );
}