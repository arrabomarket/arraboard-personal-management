import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import SubscriptionForm from "@/components/subscriptions/SubscriptionForm";
import SubscriptionList from "@/components/subscriptions/SubscriptionList";

interface Subscription {
  id: string;
  name: string;
  url: string;
  expiry_date: string;
  amount: number;
}

export default function Subscriptions() {
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const queryClient = useQueryClient();

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingSubscription?.name || !editingSubscription?.url || !editingSubscription?.expiry_date || !editingSubscription?.amount) {
      toast.error("Kérlek tölts ki minden mezőt!");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nincs bejelentkezett felhasználó!");
        return;
      }

      if (editingSubscription.id) {
        const { error } = await supabase
          .from("subscriptions")
          .update({
            name: editingSubscription.name,
            url: editingSubscription.url,
            expiry_date: new Date(editingSubscription.expiry_date).toISOString(),
            amount: editingSubscription.amount,
          })
          .eq("id", editingSubscription.id);

        if (error) throw error;
        toast.success("Előfizetés sikeresen módosítva!");
        setEditingSubscription(null);
      } else {
        const { error } = await supabase.from("subscriptions").insert({
          name: editingSubscription.name,
          url: editingSubscription.url,
          expiry_date: new Date(editingSubscription.expiry_date).toISOString(),
          amount: editingSubscription.amount,
          user_id: user.id,
        });

        if (error) throw error;
        toast.success("Előfizetés sikeresen hozzáadva!");
        setEditingSubscription(null);
      }

      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error handling subscription:", error);
      toast.error("Hiba történt a művelet során");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from("subscriptions")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Előfizetés sikeresen törölve!");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error deleting subscription:", error);
      toast.error("Hiba történt az előfizetés törlésekor");
    }
  };

  if (isLoading) {
    return <div>Betöltés...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Előfizetések</h1>
      </div>

      <SubscriptionForm
        subscription={editingSubscription}
        onSubmit={handleSubmit}
        onCancel={() => setEditingSubscription(null)}
      />

      <SubscriptionList
        subscriptions={subscriptions || []}
        onEdit={setEditingSubscription}
        onDelete={handleDelete}
      />
    </div>
  );
}