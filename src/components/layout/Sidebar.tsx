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
  Grid3x3,
  CreditCard,
} from "lucide-react";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  const links = [
    { href: "/", label: "Irányítópult", icon: Home },
    { href: "/tasks", label: "Tennivalók", icon: Target },
    { href: "/notes", label: "Jegyzetek", icon: FileText },
    { href: "/finance", label: "Pénzügyek", icon: Wallet },
    { href: "/projects", label: "Projektek", icon: ScrollText },
    { href: "/contacts", label: "Kapcsolatok", icon: Contact2 },
    { href: "/links", label: "Linkek", icon: LinkIcon },
    { href: "/calendar", label: "Naptár", icon: Calendar },
    { href: "/passwords", label: "Jelszókezelő", icon: Lock },
    { href: "/subscriptions", label: "Előfizetések", icon: CreditCard },
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white text-black">
      <div className="p-6">
        <div className="flex items-center gap-2">
          <Grid3x3 className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl tracking-tight">ArraBoard</span>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} to={href} onClick={handleClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-black hover:bg-[#222222] hover:text-white",
                location.pathname === href && "bg-[#222222] text-white"
              )}
            >
              <Icon className="h-4 w-4 text-primary" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t border-black/10 p-4 space-y-2">
        <Link to="/impresszum" onClick={handleClick}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-black hover:bg-gray-200",
              location.pathname === "/impresszum" && "bg-gray-200"
            )}
          >
            <SettingsIcon className="h-4 w-4 text-primary" />
            Impresszum
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-black hover:bg-gray-200"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-primary" />
          Kijelentkezés
        </Button>
      </div>
    </div>
  );
}