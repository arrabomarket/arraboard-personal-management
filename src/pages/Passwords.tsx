import { useState, useEffect } from "react";
import { toast } from "sonner";
import PasswordForm from "@/components/passwords/PasswordForm";
import PasswordList from "@/components/passwords/PasswordList";

interface Password {
  id: string;
  name: string;
  url: string;
  password: string;
}

export default function Passwords() {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPassword, setEditingPassword] = useState<Password | null>(null);

  // Load passwords from localStorage on component mount
  useEffect(() => {
    const savedPasswords = localStorage.getItem("passwords");
    if (savedPasswords) {
      setPasswords(JSON.parse(savedPasswords));
    }
  }, []);

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("passwords", JSON.stringify(passwords));
  }, [passwords]);

  const handleSubmit = (passwordData: Omit<Password, "id">) => {
    if (editingPassword) {
      // Update existing password
      const updatedPasswords = passwords.map((password) =>
        password.id === editingPassword.id
          ? { ...password, ...passwordData }
          : password
      );
      setPasswords(updatedPasswords);
      toast.success("Jelszó sikeresen módosítva!");
    } else {
      // Add new password
      const newPassword: Password = {
        id: crypto.randomUUID(),
        ...passwordData,
      };
      setPasswords([...passwords, newPassword]);
      toast.success("Jelszó sikeresen hozzáadva!");
    }
    setEditingPassword(null);
  };

  const handleDelete = (id: string) => {
    setPasswords(passwords.filter((password) => password.id !== id));
    toast.success("Jelszó sikeresen törölve!");
  };

  const filteredPasswords = passwords.filter((password) =>
    Object.values(password)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Jelszókezelő</h1>

      <PasswordForm
        password={editingPassword}
        onSubmit={handleSubmit}
        onCancel={() => setEditingPassword(null)}
      />

      <PasswordList
        passwords={filteredPasswords}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onEdit={setEditingPassword}
        onDelete={handleDelete}
      />
    </div>
  );
}