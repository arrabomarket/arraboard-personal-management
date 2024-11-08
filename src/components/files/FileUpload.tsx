import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { FilePlus } from "lucide-react";

interface FileUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onUpload(acceptedFiles[0]);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-lg p-8
        flex flex-col items-center justify-center
        cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'}
        ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <input {...getInputProps()} />
      <FilePlus className="h-10 w-10 text-gray-400 mb-4" />
      {isDragActive ? (
        <p>Húzd ide a fájlt...</p>
      ) : (
        <div className="text-center">
          <p className="text-sm text-gray-600">
            {isUploading ? 'Feltöltés...' : 'Húzd ide a fájlt, vagy kattints a böngészéshez'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Támogatott formátumok: jpg, png, svg, ico, zip, rar, pdf, doc, txt, xls
          </p>
          <p className="text-xs text-gray-500">
            Maximum méret: 256MB
          </p>
        </div>
      )}
    </div>
  );
}