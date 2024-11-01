import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beállítások</h1>
      <Card>
        <CardHeader>
          <CardTitle>Általános beállítások</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Settings content will be added later */}
        </CardContent>
      </Card>
    </div>
  );
}