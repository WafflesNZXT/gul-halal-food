import React from "react";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  variant?: "header" | "footer" | "compact";
  scrolled?: boolean;
  className?: string;
};

const grandmotherCutout = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/brand/gul-grandmother-cutout.webp`;

export function BrandLockup({ variant = "header", scrolled = false, className }: BrandLockupProps) {
  const isFooter = variant === "footer";
  const isCompact = variant === "compact";

  // When scrolled (dark green navbar): Gul, Halal, Pakistani Catering → white; Food remains brand red.
  const gulColor = isFooter ? "text-[#FFF8E8]" : scrolled ? "text-white" : "text-primary";
  const halalColor = isFooter ? "text-[#DDE8C8]" : scrolled ? "text-white" : "text-primary";
  const foodColor = isFooter ? "text-secondary" : scrolled ? "text-[#FECACA]" : "text-secondary";
  const taglineColor = isFooter ? "text-[#DDE8C8]/85" : scrolled ? "text-white/90" : "text-primary/70";

  return (
    <div className={cn("flex items-center", isCompact ? "gap-1.5" : "gap-2.5", className)}>
      <img
        src={grandmotherCutout}
        alt="Illustrated grandmother serving a covered food platter for Gul Halal Food"
        width={160}
        height={74}
        className={cn(
          "shrink-0 object-contain object-center",
          isCompact ? "h-11 w-[4.5rem]" : "h-[4.5rem] w-32 sm:h-20 sm:w-36",
        )}
      />

      {/* Wordmark — three lines with even visual spacing */}
      <span
        className={cn(
          "flex min-w-0 flex-col leading-none",
          isCompact ? "gap-[3px]" : "gap-[5px]",
        )}
      >
        {/* "Gul" — shifted down a touch so the cap-height aligns with "Halal Food" */}
        <span
          className={cn(
            "font-display font-bold tracking-tight block motion-safe:transition-colors motion-safe:duration-300",
            gulColor,
            isCompact ? "text-[1.25rem]" : "text-[2.1rem]",
            isCompact ? "mt-[1px]" : "mt-[2px]",
          )}
        >
          Gul
        </span>

        <span
          className={cn(
            "font-display font-bold tracking-tight block",
            isCompact ? "text-[0.95rem]" : "text-[1.35rem]",
          )}
        >
          <span className={cn("motion-safe:transition-colors motion-safe:duration-300", halalColor)}>Halal </span>
          <span className={foodColor}>Food</span>
        </span>

        <span
          className={cn(
            "font-bold uppercase tracking-[0.16em] block motion-safe:transition-colors motion-safe:duration-300",
            taglineColor,
            isCompact ? "text-[0.46rem]" : "text-[0.54rem]",
          )}
        >
          Pakistani Catering
        </span>
      </span>
    </div>
  );
}
