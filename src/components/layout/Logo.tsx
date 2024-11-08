import { Hexagon, Triangle, Circle } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2 px-2">
      <div className="relative h-8 w-8">
        {/* Base hexagon */}
        <Hexagon 
          className="absolute inset-0 h-8 w-8 text-[#13A3B5] stroke-[1.5]" 
        />
        {/* Inner triangle */}
        <Triangle 
          className="absolute inset-0 h-5 w-5 translate-x-1.5 translate-y-1.5 text-[#222222] stroke-[1.5]" 
        />
        {/* Small circle accent */}
        <Circle 
          className="absolute h-2 w-2 translate-x-3 translate-y-3 text-[#d6d6d6] stroke-[2] fill-[#d6d6d6]" 
        />
      </div>
      <span className="font-bold text-xl tracking-tight text-[#222222]">ArraBoard</span>
    </div>
  );
}