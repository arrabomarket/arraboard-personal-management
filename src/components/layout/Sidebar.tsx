import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Contact2,
  FileText,
  Home,
  Link as LinkIcon,
  LogOut,
  ScrollText,
  Target,
  Wallet,
  Lock,
  Settings as SettingsIcon,
} from "lucide-react";
import Logo from "./Logo";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const currentUser = localStorage.getItem("currentUser");

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const links = [
    { href: "/", label: "Áttekintés", icon: Home },
    { href: "/tasks", label: "Tennivalók", icon: Target },
    { href: "/notes", label: "Jegyzetek", icon: FileText },
    { href: "/finance", label: "Pénzügyek", icon: Wallet },
    { href: "/projects", label: "Projektek", icon: ScrollText },
    { href: "/contacts", label: "Kapcsolatok", icon: Contact2 },
    { href: "/links", label: "Linkek", icon: LinkIcon },
    { href: "/calendar", label: "Naptár", icon: Calendar },
    { href: "/passwords", label: "Jelszókezelő", icon: Lock },
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} to={href} onClick={handleClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2",
                location.pathname === href && "bg-accent text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4 space-y-2">
        <div className="px-3 text-sm text-muted-foreground">
          Bejelentkezve mint: {currentUser}
        </div>
        <Link to="/settings" onClick={handleClick}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
          >
            <SettingsIcon className="h-4 w-4" />
            Beállítások
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Kijelentkezés
        </Button>
      </div>
    </div>
  );
}