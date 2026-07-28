import React from "react";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  variant?: "header" | "footer" | "compact";
  className?: string;
};

const grandmotherCutout = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/brand/gul-grandmother-cutout.webp`;

export function BrandLockup({ variant = "header", className }: BrandLockupProps) {
  const isFooter = variant === "footer";
  const isCompact = variant === "compact";

  return (
    <div className={cn("flex items-center", isCompact ? "gap-2" : "gap-3", className)}>
      <img
        src={grandmotherCutout}
        alt="Illustrated grandmother serving a covered food platter for Gul Halal Food"
        width={160}
        height={74}
        className={cn(
          "shrink-0 object-contain object-center",
          isCompact ? "h-12 w-24" : "h-20 w-36 sm:h-[88px] sm:w-40",
        )}
      />
      <span className={cn("flex min-w-0 flex-col leading-none", isCompact ? "gap-0.5" : "gap-1") }>
        <span className={cn("font-display font-bold tracking-tight", isFooter ? "text-[#FFF8E8]" : "text-primary", isCompact ? "text-xl" : "text-4xl")}>Gul</span>
        <span className={cn("font-display font-bold tracking-tight", isCompact ? "text-base" : "text-2xl") }>
          <span className={isFooter ? "text-[#DDE8C8]" : "text-primary"}>Halal </span><span className="text-secondary">Food</span>
        </span>
        <span className={cn("font-bold uppercase tracking-[0.16em]", isFooter ? "text-[#DDE8C8]/85" : "text-primary/75", isCompact ? "text-[0.48rem]" : "text-[0.58rem]")}>Pakistani Catering</span>
      </span>
    </div>
  );
}
