import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface ContactFormProps {
  contact: Contact | null;
  onSubmit: (contact: Omit<Contact, "id">) => void;
  onCancel?: () => void;
}

export default function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const notes = formData.get("notes") as string;

    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Kérjük töltse ki a kötelező mezőket!");
      return;
    }

    onSubmit({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Név *
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={contact?.name}
            placeholder="Teljes név"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            E-mail cím *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={contact?.email}
            placeholder="pelda@email.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium">
            Telefonszám *
          </label>
          <Input
            id="phone"
            name="phone"
            defaultValue={contact?.phone}
            placeholder="+36 XX XXX XXXX"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">
            Egyéb adatok
          </label>
          <Input
            id="notes"
            name="notes"
            defaultValue={contact?.notes}
            placeholder="További információk..."
          />
        </div>
      </div>
      <div className="flex gap-2">
        {contact && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Mégse
          </Button>
        )}
        <Button type="submit" className="w-full">
          {contact ? "Mentés" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  );
}