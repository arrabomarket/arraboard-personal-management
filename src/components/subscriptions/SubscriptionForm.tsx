import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SubscriptionFormProps {
  name: string;
  url: string;
  expiryDate: Date | undefined;
  amount: string;
  onNameChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onExpiryDateChange: (date: Date | undefined) => void;
  onAmountChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function SubscriptionForm({
  name,
  url,
  expiryDate,
  amount,
  onNameChange,
  onUrlChange,
  onExpiryDateChange,
  onAmountChange,
  onSubmit,
}: SubscriptionFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Név</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Netflix"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            value={url}
            onChange={(e) => onUrlChange(e.target.value)}
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
                onSelect={onExpiryDateChange}
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
            onChange={(e) => onAmountChange(e.target.value)}
            placeholder="4990"
            type="number"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">Hozzáadás</Button>
    </form>
  );
}