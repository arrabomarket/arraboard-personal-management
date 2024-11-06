import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  useEffect(() => {
    const savedLinks = localStorage.getItem("links");
    if (savedLinks) {
      setLinks(JSON.parse(savedLinks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("links", JSON.stringify(links));
  }, [links]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim() || !category.trim()) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    if (editingLink) {
      const updatedLinks = links.map((link) =>
        link.id === editingLink.id
          ? { ...link, name: name.trim(), url: url.trim(), category: category.trim() }
          : link
      );
      setLinks(updatedLinks);
      toast.success("Link sikeresen módosítva!");
    } else {
      const newLink: Link = {
        id: crypto.randomUUID(),
        name: name.trim(),
        url: url.trim(),
        category: category.trim(),
      };
      setLinks([...links, newLink]);
      toast.success("Link sikeresen hozzáadva!");
    }

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
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-600">
              Link neve *
            </label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Link neve"
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="url" className="text-sm font-medium text-gray-600">
              Hivatkozás *
            </label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="bg-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium text-gray-600">
              Kategória *
            </label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Kategória"
              required
              className="bg-white"
            />
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
              className="hover:bg-gray-100"
            >
              Mégse
            </Button>
          )}
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            {editingLink ? "Mentés" : "Hozzáadás"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Linkek listája</h2>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 bg-white"
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