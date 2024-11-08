import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Subscription {
  id: string;
  name: string;
  url: string;
  expiry_date: string;
  amount: number;
}

interface SubscriptionFormProps {
  subscription: Subscription | null;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export default function SubscriptionForm({
  subscription,
  onSubmit,
  onCancel,
}: SubscriptionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Név</Label>
          <Input
            id="name"
            value={subscription?.name || ""}
            onChange={(e) => subscription && (subscription.name = e.target.value)}
            placeholder="Netflix"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={subscription?.url || ""}
            onChange={(e) => subscription && (subscription.url = e.target.value)}
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
                  !subscription?.expiry_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {subscription?.expiry_date ? format(new Date(subscription.expiry_date), "yyyy.MM.dd") : "Válassz dátumot"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={subscription?.expiry_date ? new Date(subscription.expiry_date) : undefined}
                onSelect={(date) => subscription && (subscription.expiry_date = date?.toISOString() || "")}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amount">Fizetendő összeg</Label>
          <Input
            id="amount"
            value={subscription?.amount || ""}
            onChange={(e) => subscription && (subscription.amount = parseFloat(e.target.value) || 0)}
            placeholder="4990"
            type="number"
          />
        </div>
      </div>

      <div className="flex gap-2">
        {subscription?.id && (
          <Button type="button" variant="outline" onClick={onCancel} className="w-full">
            Mégse
          </Button>
        )}
        <Button type="submit" className="w-full">
          {subscription?.id ? "Mentés" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  );
}