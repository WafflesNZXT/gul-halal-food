import React from "react";
import { CheckCircle2, Home, Heart } from "lucide-react";

export function TrustFeatures() {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8 w-full max-w-2xl">
      <div className="flex items-center gap-3 bg-card/80 backdrop-blur px-4 py-3 rounded-2xl border border-border/50 shadow-sm flex-1">
        <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground leading-tight">100% Halal</span>
          <span className="text-xs text-foreground/70 leading-tight">Prepared with care</span>
        </div>
      </div>

      <div className="hidden md:block w-px bg-border/50 my-2" />

      <div className="flex items-center gap-3 bg-card/80 backdrop-blur px-4 py-3 rounded-2xl border border-border/50 shadow-sm flex-1">
        <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center shrink-0">
          <Home size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground leading-tight">Homemade Taste</span>
          <span className="text-xs text-foreground/70 leading-tight">Just like home</span>
        </div>
      </div>

      <div className="hidden md:block w-px bg-border/50 my-2" />

      <div className="flex items-center gap-3 bg-card/80 backdrop-blur px-4 py-3 rounded-2xl border border-border/50 shadow-sm flex-1">
        <div className="w-10 h-10 bg-[#DDE8C8] text-primary rounded-full flex items-center justify-center shrink-0">
          <Heart size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-foreground leading-tight">For Every Occasion</span>
          <span className="text-xs text-foreground/70 leading-tight">Weddings & parties</span>
        </div>
      </div>
    </div>
  );
}
