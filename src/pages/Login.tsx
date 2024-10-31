import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, User } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/layout/Logo";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error("Kérjük töltse ki az összes mezőt!");
      return;
    }

    try {
      // Demo célból csak ellenőrizzük a localStorage-ból
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find((u: any) => u.username === username && u.password === password);
      
      if (user || (username === 'admin' && password === 'password')) {
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("currentUser", username);
        toast.success("Sikeres bejelentkezés!");
        navigate("/");
      } else {
        toast.error("Hibás felhasználónév vagy jelszó!");
      }
    } catch (error) {
      toast.error("Hiba történt a bejelentkezés során!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <Logo />
          <CardTitle className="text-2xl font-bold mt-4">Bejelentkezés</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
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
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Elfelejtett jelszó?
              </Link>
            </div>
            <Button type="submit" className="w-full">
              Bejelentkezés
            </Button>
            <div className="text-center text-sm">
              Még nincs fiókja? <Link to="/register" className="text-primary hover:underline">Regisztráció</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}