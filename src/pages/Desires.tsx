import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GoalForm from "@/components/goals/GoalForm";
import GoalList from "@/components/goals/GoalList";

interface Goal {
  id: string;
  title: string;
  price: number;
  priority: string;
}

export default function Goals() {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery({
    queryKey: ["goals"],
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

  const handleSubmit = async (goalData: Omit<Goal, "id">) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nincs bejelentkezett felhasználó!");
        return;
      }

      if (editingGoal) {
        const { error } = await supabase
          .from("desires")
          .update({
            title: goalData.title,
            price: goalData.price,
            priority: goalData.priority,
          })
          .eq("id", editingGoal.id);

        if (error) throw error;
        toast.success("Cél sikeresen módosítva!");
        setEditingGoal(null);
      } else {
        const { error } = await supabase.from("desires").insert({
          title: goalData.title,
          price: goalData.price,
          priority: goalData.priority,
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("Cél sikeresen hozzáadva!");
      }

      queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch (error) {
      console.error("Error handling goal:", error);
      toast.error("Hiba történt a művelet során");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("desires")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Cél sikeresen törölve!");
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast.error("Hiba történt a cél törlésekor");
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Célok</h1>
      </div>

      <GoalForm 
        goal={editingGoal}
        onSubmit={handleSubmit}
        onCancel={() => setEditingGoal(null)}
      />
      <GoalList 
        goals={goals || []} 
        onEdit={setEditingGoal}
        onDelete={handleDelete}
      />
    </div>
  );
}