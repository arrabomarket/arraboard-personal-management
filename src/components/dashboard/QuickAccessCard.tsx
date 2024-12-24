import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, FileText, Link2, Contact2 } from "lucide-react";

export default function QuickAccessCard() {
  return (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Gyors elérés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <a href="/tasks" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <ListTodo className="h-5 w-5 text-primary" />
            <span>Tennivalók</span>
          </a>
          <a href="/notes" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <FileText className="h-5 w-5 text-primary" />
            <span>Jegyzetek</span>
          </a>
          <a href="/links" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Link2 className="h-5 w-5 text-primary" />
            <span>Linkek</span>
          </a>
          <a href="/contacts" className="flex items-center gap-2 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Contact2 className="h-5 w-5 text-primary" />
            <span>Kapcsolatok</span>
          </a>
        </div>
      </CardContent>
    </Card>
  );
}