import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Copy, ArrowRight, Trash2, Edit2 } from "lucide-react";
import { formatBytes } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface File {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

interface FileTableProps {
  files: File[];
}

const truncateFilename = (filename: string, maxLength: number = 16) => {
  return filename.length > maxLength ? `${filename.slice(0, maxLength)}...` : filename;
};

export function FileTable({ files }: FileTableProps) {
  const handleView = async (file: File) => {
    try {
      const { data } = await supabase.storage
        .from('files')
        .createSignedUrl(file.file_path, 60);

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      toast.error('Hiba történt a fájl megnyitásakor');
    }
  };

  const handleDelete = async (file: File) => {
    try {
      const { error: storageError } = await supabase.storage
        .from('files')
        .remove([file.file_path]);

      if (storageError) throw storageError;

      const { error: dbError } = await supabase
        .from('files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      toast.success('Fájl sikeresen törölve');
    } catch (error) {
      toast.error('Hiba történt a fájl törlésekor');
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Név</TableHead>
            <TableHead>Típus</TableHead>
            <TableHead>Méret</TableHead>
            <TableHead>Feltöltve</TableHead>
            <TableHead className="text-right">Műveletek</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <TableRow key={file.id}>
              <TableCell title={file.filename}>{truncateFilename(file.filename)}</TableCell>
              <TableCell>{file.content_type}</TableCell>
              <TableCell>{formatBytes(file.size)}</TableCell>
              <TableCell>
                {new Date(file.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleView(file)}>
                  <Eye className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon">
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit2 className="h-4 w-4 text-primary" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(file)}>
                  <Trash2 className="h-4 w-4 text-[#222222]" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {files.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                Nincsenek feltöltött fájlok
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
