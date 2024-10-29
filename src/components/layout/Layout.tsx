import { Toaster } from "@/components/ui/sonner";
import Sidebar from "./Sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "jelszó") {
      setIsLoggedIn(true);
      toast.success("Sikeres bejelentkezés!");
    } else {
      toast.error("Hibás felhasználónév vagy jelszó!");
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Menu and Login */}
      <div className="md:hidden fixed top-4 right-4 z-50 flex gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <LogIn className="h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Bejelentkezés</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Felhasználónév"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Jelszó"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={handleLogin} className="w-full">
                Bejelentkezés
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <Sidebar />
          </SheetContent>
        </Sheet>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          {children}
        </div>
      </main>
      <Toaster />
    </div>
  );
}