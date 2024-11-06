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
                  className="text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
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