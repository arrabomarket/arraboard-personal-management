import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Wallet, 
  FolderKanban, 
  Users, 
  Link as LinkIcon 
} from "lucide-react";

const navigation = [
  { name: "Irányítópult", href: "/", icon: LayoutDashboard },
  { name: "Tennivalók", href: "/tasks", icon: CheckSquare },
  { name: "Jegyzetek", href: "/notes", icon: FileText },
  { name: "Pénzügy", href: "/finance", icon: Wallet },
  { name: "Projektek", href: "/projects", icon: FolderKanban },
  { name: "Kapcsolatok", href: "/contacts", icon: Users },
  { name: "Linkek", href: "/links", icon: LinkIcon },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-white border-r border-border flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold">ArraBoard</h1>
      </div>
      <nav className="flex-1 px-3 py-2 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn("sidebar-link", isActive && "active")}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}