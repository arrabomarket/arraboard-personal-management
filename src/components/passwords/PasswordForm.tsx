import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Password {
  id: string;
  name: string;
  url: string;
  password: string;
}

interface PasswordFormProps {
  password: Password | null;
  onSubmit: (password: Omit<Password, "id">) => void;
  onCancel?: () => void;
}

export default function PasswordForm({ password, onSubmit, onCancel }: PasswordFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const passwordValue = formData.get("password") as string;

    if (!name.trim() || !url.trim() || !passwordValue.trim()) {
      toast.error("Kérjük töltse ki a kötelező mezőket!");
      return;
    }

    onSubmit({
      name: name.trim(),
      url: url.trim(),
      password: passwordValue.trim(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full bg-white p-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Oldal neve *
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={password?.name}
            placeholder="Oldal neve"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium">
            URL *
          </label>
          <Input
            id="url"
            name="url"
            type="url"
            defaultValue={password?.url}
            placeholder="https://example.com"
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Jelszó *
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue={password?.password}
            placeholder="••••••••"
            required
          />
        </div>
      </div>
      <div className="flex gap-2">
        {password && (
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
          {password ? "Mentés" : "Hozzáadás"}
        </Button>
      </div>
    </form>
  );
}