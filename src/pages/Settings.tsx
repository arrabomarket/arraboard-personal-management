import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

interface Profile {
  username: string;
  created_at: string;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

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
              <p className="text-muted-foreground">{profile?.username}</p>
            </div>
            <div>
              <Label>Regisztráció dátuma</Label>
              <p className="text-muted-foreground">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : ''}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Impresszum</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
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