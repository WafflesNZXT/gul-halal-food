import React from "react";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      {/* Decorative background blob */}
      <div className="absolute -left-32 top-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <div className="w-full lg:w-1/2">
            <div className="relative w-full max-w-md mx-auto aspect-[3/4] bg-card border-8 border-card shadow-2xl rounded-t-full rounded-b-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-muted/30 flex items-center justify-center p-8 text-center border border-border border-dashed m-4 rounded-t-[180px] rounded-b-lg group-hover:bg-muted/40 transition-colors">
                <div className="flex flex-col items-center gap-4 text-primary opacity-60">
                  <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <p className="font-display text-xl">Generations of culinary heritage</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 space-y-6">
            <SectionHeading 
              title="Family Recipes, Shared with Love" 
              centered={false} 
            />
            
            <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
              <p>
                Since 1985, Gul Halal Food has been a cornerstone of our community's celebrations. What started as a small family kitchen sharing traditional recipes with neighbors has grown into a beloved catering service.
              </p>
              <p>
                We believe that food is more than just sustenance—it's a way to show care, hospitality, and love. Every dish we prepare is rooted in authentic Pakistani culinary tradition, using the same spice blends and slow-cooking methods our grandparents taught us.
              </p>
              <p>
                Whether we're serving 50 people or 500, we never compromise on quality or our 100% halal commitment. When you choose us for your event, you're not just getting a caterer; you're inviting our family to cook for yours.
              </p>
            </div>

            <div className="bg-card p-6 rounded-2xl border-l-4 border-secondary mt-8 shadow-sm">
              <p className="font-display text-2xl text-primary italic">
                "Every gathering deserves food made with care."
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
