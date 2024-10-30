import { Code2 } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 px-2">
      <Code2 className="h-8 w-8" />
      <span className="font-bold text-xl tracking-tight">ArraBoard</span>
    </div>
  );
}