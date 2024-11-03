import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
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
import { supabase } from "@/integrations/supabase/client";

interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation();
  const { t } = useLanguage();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const links = [
    { href: "/", label: t("overview"), icon: Home },
    { href: "/tasks", label: t("tasks"), icon: Target },
    { href: "/notes", label: t("notes"), icon: FileText },
    { href: "/finance", label: t("finance"), icon: Wallet },
    { href: "/projects", label: t("projects"), icon: ScrollText },
    { href: "/contacts", label: t("contacts"), icon: Contact2 },
    { href: "/links", label: t("links"), icon: LinkIcon },
    { href: "/calendar", label: t("calendar"), icon: Calendar },
    { href: "/passwords", label: t("passwords"), icon: Lock },
  ];

  const handleClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white dark:bg-background">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} to={href} onClick={handleClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 hover:bg-black hover:text-white",
                location.pathname === href && "bg-black text-white"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t p-4 space-y-2">
        <Link to="/settings" onClick={handleClick}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 hover:bg-black hover:text-white",
              location.pathname === "/settings" && "bg-black text-white"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            {t("settings")}
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-black hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </Button>
      </div>
    </div>
  );
}