import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Contact2,
  FileText,
  Home,
  Link as LinkIcon,
  Lock,
  LogOut,
  ScrollText,
  Settings as SettingsIcon,
  Target,
  Wallet,
} from "lucide-react";
import Logo from "./Logo";
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
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
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-14 items-center px-4">
        <Logo />
      </div>
      <div className="flex-1 space-y-2 px-4">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            onClick={handleClick}
            className={cn("sidebar-link", {
              active: location.pathname === link.href,
            })}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </div>
      <div className="mt-auto space-y-2 px-4 pb-4">
        <Link to="/settings" onClick={handleClick}>
          <Button
            variant="ghost"
            className={cn("w-full justify-start gap-2", {
              "bg-black text-white": location.pathname === "/settings",
            })}
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