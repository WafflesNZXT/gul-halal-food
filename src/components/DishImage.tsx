import React, { useState } from "react";
import { UtensilsCrossed } from "lucide-react";

export function DishImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  const [missing, setMissing] = useState(!src);

  if (missing) {
    return <div className={`flex items-center justify-center bg-muted/45 text-primary/60 ${className ?? ""}`}>
      <div className="flex flex-col items-center gap-3 text-center p-6"><UtensilsCrossed size={38} aria-hidden="true" /><span className="font-display text-lg">Dish image coming soon</span></div>
    </div>;
  }

  return <img src={src} alt={alt} onError={() => setMissing(true)} className={className} />;
}
