import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Logo from "./Logo";
import {
  Calendar,
  Contact2,
  FileText,
  Home,
  Link as LinkIcon,
  LogOut,
  Target,
  Wallet,
  Lock,
  Settings as SettingsIcon,
  ShoppingBag,
  Files,
} from "lucide-react";

const NAVIGATION_LINKS = [
  { href: "/", label: "Irányítópult", icon: Home },
  { href: "/tasks", label: "Tennivalók", icon: Target },
  { href: "/notes", label: "Jegyzetek", icon: FileText },
  { href: "/finance", label: "Pénzügyek", icon: Wallet },
  { href: "/contacts", label: "Kapcsolatok", icon: Contact2 },
  { href: "/links", label: "Linkek", icon: LinkIcon },
  { href: "/calendar", label: "Naptár", icon: Calendar },
  { href: "/passwords", label: "Jelszókezelő", icon: Lock },
  { href: "/subscriptions", label: "Előfizetések", icon: ShoppingBag },
  { href: "/desires", label: "Vásárlás", icon: ShoppingBag },
  { href: "/files", label: "Fájlok", icon: Files },
];

const NavButton = ({ href, label, icon: Icon, isActive, onClick }: {
  href: string;
  label: string;
  icon: any;
  isActive: boolean;
  onClick: () => void;
}) => (
  <Link to={href} onClick={onClick}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900",
        isActive && "bg-gray-100 text-gray-900 font-medium"
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  </Link>
);

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white">
      <div className="p-6">
        <Logo />
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {NAVIGATION_LINKS.map((link) => (
          <NavButton
            key={link.href}
            {...link}
            isActive={location.pathname === link.href}
            onClick={onNavigate || (() => {})}
          />
        ))}
      </nav>
      <div className="border-t border-gray-200 p-4 space-y-2">
        <NavButton
          href="/impresszum"
          label="Impresszum"
          icon={SettingsIcon}
          isActive={location.pathname === "/impresszum"}
          onClick={onNavigate || (() => {})}
        />
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-gray-600 hover:bg-gray-100"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Kijelentkezés
        </Button>
      </div>
    </div>
  );
}