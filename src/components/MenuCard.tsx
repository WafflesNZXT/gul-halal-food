import React from "react";
import { MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SpiceLevel } from "@/components/SpiceLevel";

export function MenuCard({ item }: { item: MenuItem }) {
  const hasImage = Boolean(item.image);
  const detailHref = item.featured
    ? `/menu/${item.slug}`
    : `/quote?dish=${encodeURIComponent(item.name)}`;

  return (
    <>
      {/* ── Mobile compact card (< sm, i.e. < 640px) ───────────────────────────
          Entire card is a single <Link> — no nested links or buttons inside.
          Two of these fit per row on 360–430px viewports.
      ─────────────────────────────────────────────────────────────────────── */}
      <Link
        href={detailHref}
        aria-label={`View ${item.name}`}
        className="sm:hidden flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-[0.97] transition-transform duration-150 h-full"
      >
        {/* Image area — square, padded */}
        <div className="aspect-square w-full flex items-center justify-center bg-muted/20 p-3">
          {hasImage ? (
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-contain drop-shadow-sm"
            />
          ) : (
            <span className="text-5xl" aria-hidden="true">
              {item.icon}
            </span>
          )}
        </div>

        {/* Text content */}
        <div className="px-3 pb-4 pt-2 flex flex-col gap-1">
          <h3 className="font-display text-sm leading-tight text-primary line-clamp-2">
            {item.name}
          </h3>
          <p className="text-secondary font-bold text-xs">
            {item.price || item.pricingLabel || "Contact for pricing"}
          </p>
        </div>
      </Link>

      {/* ── Desktop / tablet full card (sm+ i.e. ≥ 640px) ─────────────────────
          Keeps existing layout: image, title, description, spice, action button.
      ─────────────────────────────────────────────────────────────────────── */}
      <div className="hidden sm:flex bg-card rounded-[2rem] p-6 border border-border shadow-sm sm:hover:-translate-y-1 transition-transform duration-300 flex-col items-center text-center gap-4 group cursor-pointer h-full">
        {/* Dish image */}
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
            className="text-primary hover:text-primary hover:bg-primary/10 rounded-full font-semibold cursor-pointer"
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
    </>
  );
}
