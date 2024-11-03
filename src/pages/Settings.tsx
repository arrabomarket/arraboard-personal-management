import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { User } from "@supabase/supabase-js";

interface Profile {
  username: string;
  created_at: string;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { setTheme, theme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, created_at')
          .eq('id', user.id)
          .single();
        if (profile) setProfile(profile);
      }
    };
    fetchUserAndProfile();
  }, []);

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    toast({
      title: value === "hu" ? "Nyelv megváltoztatva" : "Language changed",
      description: value === "hu" ? "A nyelv magyarra változott" : "Language set to English",
    });
  };

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: checked ? "Sötét mód bekapcsolva" : "Világos mód bekapcsolva",
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{t("settings")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>{t("userSettings")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{t("email")}</Label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <Label>{t("username")}</Label>
              <p className="text-muted-foreground">{profile?.username}</p>
            </div>
            <div>
              <Label>{t("memberSince")}</Label>
              <p className="text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("appearance")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t("darkMode")}</Label>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={handleThemeChange}
            />
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-2">
            <Label>{t("language")}</Label>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hu">{t("hungarian")}</SelectItem>
                <SelectItem value="en">{t("english")}</SelectItem>
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