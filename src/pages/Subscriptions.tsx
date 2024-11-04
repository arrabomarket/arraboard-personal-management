import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Név</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Netflix"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://netflix.com"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label>Lejárat dátuma</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiryDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiryDate ? format(expiryDate, "yyyy.MM.dd") : "Válassz dátumot"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiryDate}
                  onSelect={setExpiryDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Fizetendő összeg</Label>
            <Input
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="4990"
              type="number"
            />
          </div>
        </div>

        <Button type="submit" className="w-full">Hozzáadás</Button>
      </form>

      <div className="bg-white rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Név</TableHead>
              <TableHead>Link</TableHead>
              <TableHead>Lejárat dátuma</TableHead>
              <TableHead>Fizetendő összeg</TableHead>
              <TableHead className="text-right">Műveletek</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions?.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.name}</TableCell>
                <TableCell>
                  <a
                    href={subscription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </TableCell>
                <TableCell>
                  {format(new Date(subscription.expiry_date), "yyyy.MM.dd")}
                </TableCell>
                <TableCell>{subscription.amount.toLocaleString('hu-HU')} Ft</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingSubscription(subscription);
                      setIsEditDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(subscription.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Előfizetés szerkesztése</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Név</Label>
              <Input
                id="edit-name"
                value={editingSubscription?.name || ""}
                onChange={(e) =>
                  setEditingSubscription(prev =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-url">URL</Label>
              <Input
                id="edit-url"
                value={editingSubscription?.url || ""}
                onChange={(e) =>
                  setEditingSubscription(prev =>
                    prev ? { ...prev, url: e.target.value } : null
                  )
                }
                type="url"
              />
            </div>

            <div className="space-y-2">
              <Label>Lejárat dátuma</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {editingSubscription?.expiry_date
                      ? format(new Date(editingSubscription.expiry_date), "yyyy.MM.dd")
                      : "Válassz dátumot"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={editingSubscription?.expiry_date ? new Date(editingSubscription.expiry_date) : undefined}
                    onSelect={(date) =>
                      setEditingSubscription(prev =>
                        prev ? { ...prev, expiry_date: date?.toISOString() || "" } : null
                      )
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Fizetendő összeg</Label>
              <Input
                id="edit-amount"
                value={editingSubscription?.amount || ""}
                onChange={(e) =>
                  setEditingSubscription(prev =>
                    prev ? { ...prev, amount: parseFloat(e.target.value) || 0 } : null
                  )
                }
                type="number"
              />
            </div>

            <Button type="submit" className="w-full">Mentés</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}