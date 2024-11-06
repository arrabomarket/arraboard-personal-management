import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date>();
  const [amount, setAmount] = useState("");
  const [editingSubscription, setEditingSubscription] = useState<Subscription | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
    
    if (!name || !url || !expiryDate || !amount) {
      toast.error("Kérlek tölts ki minden mezőt!");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Nincs bejelentkezett felhasználó!");
        return;
      }

      const { error } = await supabase.from("subscriptions").insert({
        name,
        url,
        expiry_date: expiryDate.toISOString(),
        amount: parseFloat(amount),
        user_id: user.id,
      });

      if (error) throw error;

      toast.success("Előfizetés sikeresen hozzáadva!");
      setName("");
      setUrl("");
      setExpiryDate(undefined);
      setAmount("");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error adding subscription:", error);
      toast.error("Hiba történt az előfizetés hozzáadásakor");
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubscription) return;

    try {
      const { error } = await supabase
        .from("subscriptions")
        .update({
          name: editingSubscription.name,
          url: editingSubscription.url,
          expiry_date: new Date(editingSubscription.expiry_date).toISOString(),
          amount: parseFloat(editingSubscription.amount.toString()),
        })
        .eq("id", editingSubscription.id);

      if (error) throw error;

      toast.success("Előfizetés sikeresen módosítva!");
      setIsEditDialogOpen(false);
      setEditingSubscription(null);
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (error) {
      console.error("Error updating subscription:", error);
      toast.error("Hiba történt az előfizetés módosításakor");
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
        name={name}
        url={url}
        expiryDate={expiryDate}
        amount={amount}
        onNameChange={setName}
        onUrlChange={setUrl}
        onExpiryDateChange={setExpiryDate}
        onAmountChange={setAmount}
        onSubmit={handleSubmit}
      />

      <SubscriptionList
        subscriptions={subscriptions || []}
        onEdit={(subscription) => {
          setEditingSubscription(subscription);
          setIsEditDialogOpen(true);
        }}
        onDelete={handleDelete}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Előfizetés szerkesztése</DialogTitle>
          </DialogHeader>
          <SubscriptionForm
            name={editingSubscription?.name || ""}
            url={editingSubscription?.url || ""}
            expiryDate={editingSubscription?.expiry_date ? new Date(editingSubscription.expiry_date) : undefined}
            amount={editingSubscription?.amount?.toString() || ""}
            onNameChange={(value) => setEditingSubscription(prev => prev ? { ...prev, name: value } : null)}
            onUrlChange={(value) => setEditingSubscription(prev => prev ? { ...prev, url: value } : null)}
            onExpiryDateChange={(date) => setEditingSubscription(prev => prev ? { ...prev, expiry_date: date?.toISOString() || "" } : null)}
            onAmountChange={(value) => setEditingSubscription(prev => prev ? { ...prev, amount: parseFloat(value) || 0 } : null)}
            onSubmit={handleEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}