import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/layout/Logo";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Itt implementálnánk a valós regisztrációt
    if (!username || !email || !password) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    try {
      // Demo célból csak elmentjük localStorage-ba
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      if (users.some((u: any) => u.username === username)) {
        toast.error("Ez a felhasználónév már foglalt!");
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem("users", JSON.stringify(users));
      
      toast.success("Sikeres regisztráció!");
      navigate("/login");
    } catch (error) {
      toast.error("Hiba történt a regisztráció során!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Logo />
          <CardTitle className="text-2xl font-bold mt-4">Regisztráció</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Felhasználónév"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email cím"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Jelszó"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Button type="submit" className="w-full">
              Regisztráció
            </Button>
            <div className="text-center text-sm">
              Már van fiókja? <Link to="/login" className="text-primary hover:underline">Bejelentkezés</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}