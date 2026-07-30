import React from "react";
import { values } from "@/data/values";
import * as Icons from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { cn } from "@/lib/utils";

export function WhyChooseUs() {
  const themeStyles: Record<string, string> = {
    sage: "bg-[#DDE8C8] text-primary border-[#C2D6A1]",
    cream: "bg-[#FFF8E8] text-secondary border-[#F7E1B1]",
    forest: "bg-[#0e2710] text-white border-secondary/60 shadow-[0_4px_24px_rgba(172,32,32,0.12)]",
    ivory: "bg-[#FFFDF7] text-foreground border-border",
  };

  const iconColors: Record<string, string> = {
    sage: "text-primary",
    cream: "text-secondary",
    forest: "text-secondary",
    ivory: "text-primary",
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display mb-4 text-white">Why Choose Gul?</h2>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">
              We bring more than just food to the table. We bring tradition, reliability, and peace of mind.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, idx) => {
            const Icon = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[value.iconName] || Icons.Star;
            return (
              <Reveal key={value.id} delay={idx * 0.08}>
                <div
                  className={cn(
                    "p-8 rounded-3xl border flex flex-col items-center text-center transition-transform hover:-translate-y-2 cursor-default h-full",
                    themeStyles[value.colorTheme]
                  )}
                >
                  <div className={cn("mb-6", iconColors[value.colorTheme])}>
                    <Icon size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl mb-3">{value.title}</h3>
                  <p className="text-sm opacity-80">{value.description}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
