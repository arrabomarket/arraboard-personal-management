import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardQuickAccess() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Legutóbbi jegyzetek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-muted-foreground">Nincs megjeleníthető jegyzet</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Legutóbbi linkek</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-muted-foreground">Nincs megjeleníthető link</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Legutóbbi kapcsolatok</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-muted-foreground">Nincs megjeleníthető kapcsolat</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}