import React from "react";
import { MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function MenuCard({ item }: { item: MenuItem }) {
  return (
    <div className="bg-card rounded-[2rem] p-6 border border-border shadow-sm hover-elevate transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center text-center gap-4 group">
      <div className="w-24 h-24 bg-background rounded-full border border-border flex items-center justify-center text-5xl shadow-inner group-hover:scale-110 transition-transform duration-300">
        {item.icon}
      </div>
      
      <div className="space-y-2 flex-1">
        <h3 className="font-display text-xl text-primary">{item.name}</h3>
        <p className="text-foreground/80 text-sm">{item.description}</p>
        {item.price && (
          <p className="text-secondary font-bold text-sm mt-2">{item.price}</p>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 w-full justify-between pt-4 border-t border-border/50">
        <div className="flex gap-1" aria-label={`Spice level ${item.spiceLevel} out of 3`}>
          {[1, 2, 3].map((level) => (
            <div 
              key={level} 
              className={`w-2.5 h-2.5 rounded-full ${level <= item.spiceLevel ? 'bg-secondary' : 'bg-muted'}`}
            />
          ))}
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 rounded-full font-semibold">
          Details
        </Button>
      </div>
    </div>
  );
}
