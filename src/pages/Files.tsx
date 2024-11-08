import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FileTable } from "@/components/files/FileTable";
import { FileUpload } from "@/components/files/FileUpload";
import { toast } from "sonner";

export default function Files() {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

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

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
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
      toast.success('File uploaded successfully');
    } catch (error: any) {
      toast.error('Upload failed: ' + error.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Files</h1>
      </div>
      
      <FileUpload onUpload={handleUpload} isUploading={isUploading} />
      
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <FileTable files={files || []} />
      )}
    </div>
  );
}