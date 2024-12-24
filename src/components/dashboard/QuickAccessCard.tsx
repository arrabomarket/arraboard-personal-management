import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { FileText, Link as LinkIcon, Users, Calendar } from "lucide-react";

export default function QuickAccessCard() {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gyors elérés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/notes" className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <FileText className="h-4 w-4" />
            <span>Jegyzetek</span>
          </Link>
          <Link to="/links" className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <LinkIcon className="h-4 w-4" />
            <span>Linkek</span>
          </Link>
          <Link to="/contacts" className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <Users className="h-4 w-4" />
            <span>Kapcsolatok</span>
          </Link>
          <Link to="/calendar" className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50">
            <Calendar className="h-4 w-4" />
            <span>Naptár</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}