import React from "react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Link } from "wouter";

const familyCookingPhoto = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/images/about/family-cooking-care.webp`;

export function About() {
  return (
    <section className="py-20 bg-background overflow-hidden relative">
      {/* Decorative background blob */}
      <div className="absolute -left-32 top-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-50 pointer-events-none" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          <Reveal className="w-full lg:w-1/2">
            <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-t-[42%] rounded-b-3xl border-2 border-primary/35 bg-card p-2 shadow-xl">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[40%] rounded-b-2xl">
                <img
                  src={familyCookingPhoto}
                  alt="Family member carefully preparing a Gul Halal Food catering dish."
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div aria-hidden="true" className="absolute -right-2 -top-2 text-secondary/80">
                <svg className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C12 2 12 10 20 12C20 12 12 14 12 22C12 22 12 14 4 12C4 12 12 10 12 2Z" />
                </svg>
              </div>
            </div>
          </Reveal>

          <Reveal className="w-full lg:w-1/2" delay={0.1}>
            <div className="space-y-6">
              <SectionHeading 
                title="Family Recipes, Shared with Love" 
                centered={false} 
              />
              
              <div className="space-y-4 text-foreground/80 text-lg leading-relaxed">
                <p>Gul Halal Food is a family-owned Pakistani halal caterer, sharing food made for gatherings and celebrations.</p>
                <p>Since 1985, our kitchen has brought familiar Pakistani flavors to the table with care.</p>
              </div>
              <Link href="/about" className="inline-flex font-bold text-primary underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                Read Our Story →
              </Link>
            </div>
          </Reveal>
          
        </div>
      </div>
    </section>
  );
}
