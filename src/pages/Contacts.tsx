import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Search } from "lucide-react";
import { toast } from "sonner";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !phone.trim()) {
      toast.error("Kérjük töltse ki a kötelező mezőket!");
      return;
    }

    if (editingContact) {
      // Update existing contact
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id
          ? { ...contact, name, email, phone, notes }
          : contact
      );
      setContacts(updatedContacts);
      toast.success("Kapcsolat sikeresen módosítva!");
    } else {
      // Add new contact
      const newContact: Contact = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        notes: notes.trim(),
      };
      setContacts([...contacts, newContact]);
      toast.success("Kapcsolat sikeresen hozzáadva!");
    }

    // Reset form
    setName("");
    setEmail("");
    setPhone("");
    setNotes("");
    setEditingContact(null);
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setName(contact.name);
    setEmail(contact.email);
    setPhone(contact.phone);
    setNotes(contact.notes);
  };

  const handleDelete = (id: string) => {
    setContacts(contacts.filter((contact) => contact.id !== id));
    toast.success("Kapcsolat sikeresen törölve!");
  };

  const filteredContacts = contacts.filter((contact) =>
    Object.values(contact)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Kapcsolatok</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {editingContact ? "Kapcsolat szerkesztése" : "Új kapcsolat hozzáadása"}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Név *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+36 XX XXX XXXX"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Egyéb adatok
            </label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="További információk..."
              className="min-h-[100px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          {editingContact && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingContact(null);
                setName("");
                setEmail("");
                setPhone("");
                setNotes("");
              }}
            >
              Mégse
            </Button>
          )}
          <Button type="submit">
            {editingContact ? "Mentés" : "Hozzáadás"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Kapcsolatok listája</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Név</TableHead>
                <TableHead>E-mail cím</TableHead>
                <TableHead>Telefonszám</TableHead>
                <TableHead>Egyéb adatok</TableHead>
                <TableHead className="w-[100px]">Műveletek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => (
                <TableRow key={contact.id}>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>{contact.email}</TableCell>
                  <TableCell>{contact.phone}</TableCell>
                  <TableCell>{contact.notes}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(contact)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredContacts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Nincs találat
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}