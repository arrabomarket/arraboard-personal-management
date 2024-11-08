import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Impresszum</h1>

      <Card>
        <CardContent className="prose dark:prose-invert max-w-none space-y-4 pt-6">
          <p><strong>Készítete:</strong> Farkas Attila - ArraboMarket</p>
          <p>
            <strong>Web:</strong>{" "}
            <a 
              href="https://arrabomarket.hu" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://arrabomarket.hu
            </a>
          </p>
          <p>
            <strong>GitHub:</strong>{" "}
            <a 
              href="https://github.com/arrabomarket/arraboard-personal-management" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              https://github.com/arrabomarket/arraboard-personal-management
            </a>
          </p>
          <p><strong>Adatbázis:</strong> SupaBase</p>
          <p><strong>Felhasznált technikák:</strong></p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Vite</li>
            <li>TypeScript</li>
            <li>React</li>
            <li>shadcn-ui</li>
            <li>Tailwind CSS</li>
          </ul>
          <p><strong>Segítség:</strong> GPT Engineer</p>
          <p><strong>Licensz:</strong> MIT</p>
          <p><strong>@2024</strong></p>
        </CardContent>
      </Card>
    </div>
  );
}