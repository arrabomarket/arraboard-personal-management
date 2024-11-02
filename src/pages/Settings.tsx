import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { User } from "@supabase/supabase-js";

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [language, setLanguage] = useState<string>("hu");
  const { setTheme, theme } = useTheme();
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: "Nyelv megváltoztatva",
      description: value === "hu" ? "A nyelv magyarra változott" : "Language changed to English",
    });
  };

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
    toast({
      title: checked ? "Sötét mód bekapcsolva" : "Világos mód bekapcsolva",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Beállítások</h1>

      <Card>
        <CardHeader>
          <CardTitle>Felhasználói adatok</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Email cím</Label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <Label>Felhasználónév</Label>
              <p className="text-muted-foreground">{user?.user_metadata?.username || "Nincs megadva"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Megjelenés</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sötét mód</Label>
              <p className="text-sm text-muted-foreground">
                A felület sötét/világos megjelenítése
              </p>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label>Nyelv</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Válassz nyelvet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hu">Magyar</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impresszum</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p>
            Az oldal üzemeltetője: Arrago Life Hub<br />
            Székhely: Magyarország<br />
            Email: info@arrago.hu<br />
            Adószám: 12345678-1-23
          </p>
          <h3>Adatkezelés</h3>
          <p>
            Az oldal használata során megadott személyes adatokat bizalmasan kezeljük, 
            harmadik félnek nem adjuk át. Az adatkezelés az EU GDPR szabályozásának 
            megfelelően történik.
          </p>
          <h3>Felelősség kizárása</h3>
          <p>
            Az oldalon található információk kizárólag tájékoztató jellegűek. 
            Az üzemeltető nem vállal felelősséget az esetleges hibákért vagy 
            hiányosságokért, illetve a felhasználásból eredő károkért.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}