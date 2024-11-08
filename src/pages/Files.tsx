import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileTable } from "@/components/files/FileTable";
import { FileUpload } from "@/components/files/FileUpload";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function Files() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: files, isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: async () => {
      const { data: files, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return files;
    }
  });

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Nincs bejelentkezve");

      const { error } = await supabase
        .from('folders')
        .insert({
          name: newFolderName,
          user_id: user.id
        });

      if (error) throw error;

      toast.success('Mappa sikeresen létrehozva');
      setNewFolderName("");
      setIsDialogOpen(false);
    } catch (error: any) {
      toast.error('Hiba történt: ' + error.message);
    }
  };

  const handleUpload = async (file: File) => {
    if (file.size > 256 * 1024 * 1024) {
      toast.error('A fájl mérete nem lehet nagyobb mint 256MB');
      return;
    }

    const allowedExtensions = ['jpg', 'png', 'svg', 'ico', 'zip', 'rar', 'pdf', 'doc', 'txt', 'xls'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExt || !allowedExtensions.includes(fileExt)) {
      toast.error('Nem támogatott fájltípus');
      return;
    }

    try {
      setIsUploading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Nincs bejelentkezve");

      const filePath = `${user.id}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from('files')
        .insert({
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
          user_id: user.id
        });

      if (dbError) throw dbError;

      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Fájl sikeresen feltöltve');
    } catch (error: any) {
      toast.error('Feltöltés sikertelen: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Fájlok</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FolderPlus className="h-4 w-4 mr-2" />
              Új mappa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Új mappa létrehozása</DialogTitle>
            </DialogHeader>
            <form onSubmit={createFolder} className="space-y-4">
              <Input
                placeholder="Mappa neve"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
              />
              <Button type="submit">Létrehozás</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <FileUpload onUpload={handleUpload} isUploading={isUploading} />
      
      {isLoading ? (
        <div>Betöltés...</div>
      ) : (
        <FileTable files={files || []} />
      )}
    </div>
  );
}