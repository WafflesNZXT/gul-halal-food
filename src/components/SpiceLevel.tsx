import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

type SpiceLevelProps = {
  level: number; // 0–3
  max?: number;
  className?: string;
  iconClassName?: string;
};

/**
 * Read-only fire-icon spice indicator.
 * Filled fires = active level; muted fires = inactive.
 * Includes accessible aria-label.
 */
export function SpiceLevel({
  level,
  max = 3,
  className,
  iconClassName,
}: SpiceLevelProps) {
  const clamped = Math.max(0, Math.min(level, max));
  const label =
    clamped === 0 ? "No spice" : `Spice level ${clamped} of ${max}`;

  return (
    <span
      className={cn("inline-flex items-center gap-0.5", className)}
      aria-label={label}
    >
      {Array.from({ length: max }).map((_, i) => (
        <Flame
          key={i}
          size={14}
          className={cn(
            i < clamped
              ? "fill-secondary text-secondary"
              : "text-muted-foreground/30",
            iconClassName
          )}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}
