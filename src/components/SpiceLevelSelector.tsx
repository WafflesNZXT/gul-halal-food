import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SpiceLevelValue } from "@/types/cart";

const OPTIONS: { value: SpiceLevelValue; label: string }[] = [
  { value: 1, label: "Mild" },
  { value: 2, label: "Medium" },
  { value: 3, label: "Hot" },
];

type SpiceLevelSelectorProps = {
  value: SpiceLevelValue | null;
  onChange: (level: SpiceLevelValue) => void;
  className?: string;
  /** Unique name for the radio group — prevent collisions when multiple selectors exist on one page */
  name?: string;
};

/**
 * Accessible radio-button spice level selector.
 * Uses the same fire icon size as <SpiceLevel> for visual consistency.
 */
export function SpiceLevelSelector({
  value,
  onChange,
  className,
  name = "spice-level",
}: SpiceLevelSelectorProps) {
  return (
    <fieldset className={cn("border-0 p-0 m-0", className)}>
      <legend className="sr-only">Choose spice level</legend>
      <div className="flex items-center gap-2 flex-wrap">
        {OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex items-center gap-1.5 cursor-pointer rounded-full px-3 py-1.5 border transition-colors select-none text-sm",
                selected
                  ? "bg-secondary/15 border-secondary text-secondary font-semibold"
                  : "bg-card border-border text-foreground/70 hover:border-secondary/50 hover:text-secondary"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                className="sr-only"
              />
              <span className="inline-flex gap-0.5" aria-hidden="true">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Flame
                    key={i}
                    size={14}
                    className={cn(
                      i < opt.value
                        ? "fill-secondary text-secondary"
                        : "text-muted-foreground/25"
                    )}
                  />
                ))}
              </span>
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
