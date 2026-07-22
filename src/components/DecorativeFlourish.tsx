import React from "react";
import { cn } from "@/lib/utils";

export function DecorativeFlourish({ className }: { className?: string }) {
  // A warm leaf/sparkle flourish svg
  return (
    <svg 
      className={cn("w-6 h-6", className)} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M12 2C12 2 12 10 20 12C20 12 12 14 12 22C12 22 12 14 4 12C4 12 12 10 12 2Z" 
        fill="currentColor" 
      />
    </svg>
  );
}

export function WaveDivider({ className }: { className?: string }) {
  return (
    <svg className={cn("w-full block", className)} viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
      <path d="M0 0L48 10.7C96 21.3 192 42.7 288 58.7C384 74.7 480 85.3 576 80C672 74.7 768 53.3 864 48C960 42.7 1056 53.3 1152 64C1248 74.7 1344 85.3 1392 90.7L1440 96V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="currentColor"/>
    </svg>
  );
}

export function HeartSparkle({ className }: { className?: string }) {
  return (
    <svg className={cn("w-5 h-5", className)} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
  );
}
