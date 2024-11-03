import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beállítások</h1>

      <Card>
        <CardHeader>
          <CardTitle>Impresszum</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2 className="text-center mb-4">Impresszum</h2>
          <p>
            <strong>Készítette:</strong> Farkas Attila - ArraboMarket <strong>©</strong> <strong>2024</strong>
          </p>
          <p>
            <strong>Web:</strong>{" "}
            <a href="https://arrabomarket.hu" className="text-primary hover:underline">
              https://arrabomarket.hu
            </a>
          </p>
          <p>
            <strong>Git:</strong>{" "}
            <a href="https://github.com/arrabomarket/arraboard.git" className="text-primary hover:underline">
              https://github.com/arrabomarket/arraboard.git
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}