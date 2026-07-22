import React from "react";
import { DecorativeFlourish } from "./DecorativeFlourish";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  className?: string;
  centered?: boolean;
};

export function SectionHeading({ title, subtitle, className, centered = true }: SectionHeadingProps) {
  return (
    <div className={cn("flex flex-col gap-3", centered ? "items-center text-center" : "items-start text-left", className)}>
      <div className="flex items-center gap-3">
        {centered && <DecorativeFlourish className="text-secondary w-6 h-6 rotate-180" />}
        <h2 className="text-3xl md:text-5xl font-display text-primary">{title}</h2>
        {centered && <DecorativeFlourish className="text-secondary w-6 h-6" />}
      </div>
      {subtitle && <p className="text-foreground/80 max-w-2xl text-lg md:text-xl">{subtitle}</p>}
    </div>
  );
}
