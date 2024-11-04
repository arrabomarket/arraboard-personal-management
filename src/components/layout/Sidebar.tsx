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
    <div className="flex h-full w-64 flex-col bg-[#090909] text-white">
      <div className="p-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="175"
          zoomAndPan="magnify"
          viewBox="0 0 131.25 30.000001"
          height="40"
          preserveAspectRatio="xMidYMid meet"
          version="1.0"
        >
          <defs>
            <clipPath id="aec50f7df4">
              <path d="M 106 11 L 123 11 L 123 27.746094 L 106 27.746094 Z M 106 11" clipRule="nonzero" />
            </clipPath>
            <clipPath id="ecfc5e34b5">
              <path d="M 91.726562 7.421875 L 121 7.421875 L 121 25 L 91.726562 25 Z M 91.726562 7.421875" clipRule="nonzero" />
            </clipPath>
          </defs>
          <g clipPath="url(#aec50f7df4)">
            <path fill="#00b2a2" d="M 122.707031 11.445312 L 109.601562 22.269531 C 108.839844 22.183594 108.046875 22.417969 107.464844 23.003906 C 106.445312 24.023438 106.445312 25.671875 107.464844 26.6875 C 108.480469 27.707031 110.128906 27.707031 111.148438 26.6875 C 111.730469 26.105469 111.96875 25.3125 111.882812 24.554688 Z M 110.230469 25.773438 C 109.71875 26.285156 108.890625 26.285156 108.378906 25.773438 C 107.871094 25.261719 107.871094 24.433594 108.378906 23.921875 C 108.890625 23.410156 109.71875 23.410156 110.230469 23.921875 C 110.742188 24.433594 110.742188 25.261719 110.230469 25.773438 Z M 110.230469 25.773438" fillOpacity="1" fillRule="nonzero" />
          </g>
          <g clipPath="url(#ecfc5e34b5)">
            <path fill="#00b2a2" d="M 116.65625 15.117188 L 120.648438 11.738281 C 117.582031 9.085938 113.585938 7.472656 109.222656 7.472656 C 99.574219 7.472656 91.726562 15.320312 91.726562 24.964844 L 96.863281 24.964844 C 96.863281 18.152344 102.40625 12.609375 109.222656 12.609375 C 112.011719 12.609375 114.585938 13.550781 116.65625 15.117188 Z M 116.65625 15.117188" fillOpacity="1" fillRule="nonzero" />
          </g>
          <g fill="#FFFFFF" fillOpacity="1">
            <g transform="translate(4.649639, 24.783597)">
              <path d="M 9.4375 -2.34375 L 4.484375 -2.34375 L 3.6875 0 L 0.296875 0 L 5.109375 -13.28125 L 8.859375 -13.28125 L 13.65625 0 L 10.234375 0 Z M 8.609375 -4.84375 L 6.96875 -9.703125 L 5.34375 -4.84375 Z M 8.609375 -4.84375" />
            </g>
          </g>
          <g fill="#FFFFFF" fillOpacity="1">
            <g transform="translate(18.584082, 24.783597)">
              <path d="M 4.40625 -8.796875 C 4.78125 -9.378906 5.25 -9.835938 5.8125 -10.171875 C 6.382812 -10.503906 7.019531 -10.671875 7.71875 -10.671875 L 7.71875 -7.25 L 6.828125 -7.25 C 6.023438 -7.25 5.421875 -7.070312 5.015625 -6.71875 C 4.609375 -6.375 4.40625 -5.769531 4.40625 -4.90625 L 4.40625 0 L 1.171875 0 L 1.171875 -10.5625 L 4.40625 -10.5625 Z M 4.40625 -8.796875" />
            </g>
          </g>
        </svg>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} to={href} onClick={handleClick}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 text-white hover:bg-white/10",
                location.pathname === href && "bg-white/10"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="border-t border-white/10 p-4 space-y-2">
        <Link to="/settings" onClick={handleClick}>
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 text-white hover:bg-white/10",
              location.pathname === "/settings" && "bg-white/10"
            )}
          >
            <SettingsIcon className="h-4 w-4" />
            Beállítások
          </Button>
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Kijelentkezés
        </Button>
      </div>
    </div>
  );
}