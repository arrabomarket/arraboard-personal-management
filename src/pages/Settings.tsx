import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Impresszum</h1>

      <Card>
        <CardHeader>
          <CardTitle>Impresszum</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>Készítete: Farkas Attila - ArraboMarket</p>
          <p>Web: https://arrabomarket.hu</p>
          <p>GitHub: https://github.com/arrabomarket/arraboard-personal-management</p>
          <p>Adatbázis: SupaBase</p>
          <p>Felhasznált technikák :</p>
          <p>Vite</p>
          <p>TypeScript</p>
          <p>React</p>
          <p>shadcn-ui</p>
          <p>Tailwind CSS</p>
          <p>Segítség: GPT Engineer</p>
          <p>Licensz: GPT Engineer</p>
          <p>@2024</p>
        </CardContent>
      </Card>
    </div>
  );
}