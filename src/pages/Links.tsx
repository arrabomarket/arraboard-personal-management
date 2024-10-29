import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import LinkTable from "@/components/links/LinkTable";
import { toast } from "sonner";

interface Link {
  id: string;
  name: string;
  url: string;
  category: string;
}

export default function Links() {
  const [links, setLinks] = useState<Link[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState("");
  const [editingLink, setEditingLink] = useState<Link | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim() || !category) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    if (editingLink) {
      // Update existing link
      const updatedLinks = links.map((link) =>
        link.id === editingLink.id
          ? { ...link, name: name.trim(), url: url.trim(), category }
          : link
      );
      setLinks(updatedLinks);
      toast.success("Link sikeresen módosítva!");
    } else {
      // Add new link
      const newLink: Link = {
        id: crypto.randomUUID(),
        name: name.trim(),
        url: url.trim(),
        category,
      };
      setLinks([...links, newLink]);
      toast.success("Link sikeresen hozzáadva!");
    }

    // Reset form
    setName("");
    setUrl("");
    setCategory("");
    setEditingLink(null);
  };

  const handleEdit = (link: Link) => {
    setEditingLink(link);
    setName(link.name);
    setUrl(link.url);
    setCategory(link.category);
  };

  const handleDelete = (id: string) => {
    setLinks(links.filter((link) => link.id !== id));
    toast.success("Link sikeresen törölve!");
  };

  const filteredLinks = links.filter((link) =>
    Object.values(link)
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Linkek</h1>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {editingLink ? "Link szerkesztése" : "Új link hozzáadása"}
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Link neve *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Link neve"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium">
              Hivatkozás *
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium">
              Kategória *
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Válasszon kategóriát" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hivatalos">Hivatalos</SelectItem>
                <SelectItem value="partner">Partner</SelectItem>
                <SelectItem value="egyeb">Egyéb</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex gap-2">
          {editingLink && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingLink(null);
                setName("");
                setUrl("");
                setCategory("");
              }}
            >
              Mégse
            </Button>
          )}
          <Button type="submit">
            {editingLink ? "Mentés" : "Hozzáadás"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Linkek listája</h2>
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

        <LinkTable
          links={filteredLinks}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}