import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("password");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email + "@example.com", // Since we're using username, we'll append a domain
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast.success("Sikeres bejelentkezés!");
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Sikertelen bejelentkezés!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Bejelentkezés</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Felhasználónév"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="password"
              placeholder="Jelszó"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Bejelentkezés
          </Button>
        </form>
        <div className="text-center text-sm mt-4">
          Ha nem regisztrált még, itt megteheti: {" "}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Regisztráció
          </Link>
        </div>
      </div>
    </div>
  );
}