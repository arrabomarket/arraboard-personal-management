import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Subscription {
  id: string;
  name: string;
  url: string;
  expiry_date: string;
  amount: number;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export default function SubscriptionList({ subscriptions, onEdit, onDelete }: SubscriptionListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Table>
        <TableHeader className="hidden md:table-header-group">
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
            <TableRow key={subscription.id} className="group">
              <TableCell label="Név">{subscription.name}</TableCell>
              <TableCell label="Link">
                <a
                  href={subscription.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span className="md:hidden">Megnyitás</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </TableCell>
              <TableCell label="Lejárat dátuma">
                {format(new Date(subscription.expiry_date), "yyyy.MM.dd")}
              </TableCell>
              <TableCell label="Fizetendő összeg">
                {subscription.amount.toLocaleString('hu-HU')} Ft
              </TableCell>
              <TableCell className="md:text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(subscription)}
                >
                  <Pencil className="h-4 w-4 text-primary" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(subscription.id)}
                >
                  <Trash2 className="h-4 w-4 text-primary" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}