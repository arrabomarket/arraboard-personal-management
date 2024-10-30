import { useState, useEffect } from "react";
import { toast } from "sonner";
import ContactForm from "@/components/contacts/ContactForm";
import ContactList from "@/components/contacts/ContactList";

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
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // Load contacts from localStorage on component mount
  useEffect(() => {
    const savedContacts = localStorage.getItem("contacts");
    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    }
  }, []);

  // Save contacts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("contacts", JSON.stringify(contacts));
  }, [contacts]);

  const handleSubmit = (contactData: Omit<Contact, "id">) => {
    if (editingContact) {
      // Update existing contact
      const updatedContacts = contacts.map((contact) =>
        contact.id === editingContact.id
          ? { ...contact, ...contactData }
          : contact
      );
      setContacts(updatedContacts);
      toast.success("Kapcsolat sikeresen módosítva!");
    } else {
      // Add new contact
      const newContact: Contact = {
        id: crypto.randomUUID(),
        ...contactData,
      };
      setContacts([...contacts, newContact]);
      toast.success("Kapcsolat sikeresen hozzáadva!");
    }
    setEditingContact(null);
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

      <ContactForm
        contact={editingContact}
        onSubmit={handleSubmit}
        onCancel={() => setEditingContact(null)}
      />

      <ContactList
        contacts={filteredContacts}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={setEditingContact}
        onDelete={handleDelete}
      />
    </div>
  );
}