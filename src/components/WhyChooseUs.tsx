import React from "react";
import { values } from "@/data/values";
import * as Icons from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/utils";

export function WhyChooseUs() {
  const themeStyles = {
    sage: "bg-[#DDE8C8] text-primary border-[#C2D6A1]",
    cream: "bg-[#FFF8E8] text-secondary border-[#F7E1B1]",
    golden: "bg-accent/20 text-accent-foreground border-accent/30",
    ivory: "bg-[#FFFDF7] text-foreground border-border",
  };

  const iconColors = {
    sage: "text-primary",
    cream: "text-secondary",
    golden: "text-accent",
    ivory: "text-primary",
  };

  return (
    <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Background SVG wave at top */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none rotate-180 text-background">
        <svg className="relative block w-full h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display mb-4 text-white">Why Choose Gul?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg">We bring more than just food to the table. We bring tradition, reliability, and peace of mind.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value) => {
            const Icon = (Icons as any)[value.iconName] || Icons.Star;
            return (
              <div 
                key={value.id} 
                className={cn(
                  "p-8 rounded-3xl border shadow-sm flex flex-col items-center text-center transition-transform hover:-translate-y-2",
                  themeStyles[value.colorTheme]
                )}
              >
                <div className={cn("mb-6", iconColors[value.colorTheme])}>
                  <Icon size={48} strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-xl mb-3">{value.title}</h3>
                <p className="text-sm opacity-80">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Background SVG wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-none text-background">
        <svg className="relative block w-full h-[50px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor"></path>
        </svg>
      </div>
    </section>
  );
}
