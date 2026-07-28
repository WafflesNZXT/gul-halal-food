import React from "react";
import { MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SpiceLevel } from "@/components/SpiceLevel";

export function MenuCard({ item }: { item: MenuItem }) {
  const hasImage = Boolean(item.image);

  return (
    <div className="bg-card rounded-[2rem] p-6 border border-border shadow-sm transition-transform duration-300 hover:-translate-y-1 flex flex-col items-center text-center gap-4 group">
      {/* Dish image — no circular background, slightly larger */}
      <div className="w-32 h-32 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
        {hasImage ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain drop-shadow-md"
          />
        ) : (
          <span className="text-6xl" aria-hidden="true">
            {item.icon}
          </span>
        )}
      </div>

      <div className="space-y-2 flex-1">
        <h3 className="font-display text-xl text-primary">{item.name}</h3>
        <p className="text-foreground/80 text-sm">{item.description}</p>
        {item.price && (
          <p className="text-secondary font-bold text-sm mt-2">{item.price}</p>
        )}
      </div>

      <div className="flex items-center gap-4 mt-4 w-full justify-between pt-4 border-t border-border/50">
        <SpiceLevel level={item.spiceLevel} />
        <Button
          asChild
          variant="ghost"
          className="text-primary hover:text-primary hover:bg-primary/10 rounded-full font-semibold"
        >
          {item.featured ? (
            <Link href={`/menu/${item.slug}`}>View dish</Link>
          ) : (
            <Link href={`/quote?dish=${encodeURIComponent(item.name)}`}>
              Request pricing
            </Link>
          )}
        </Button>
      </div>
    </div>
  );
}
