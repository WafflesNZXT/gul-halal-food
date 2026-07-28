import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";
import { config } from "@/data/config";
import { WaveDivider } from "@/components/DecorativeFlourish";
import { Reveal } from "@/components/Reveal";

import { Link } from "wouter";

export function QuoteCTA() {
  return (
    <section className="relative overflow-hidden bg-primary pb-24 pt-0">
      <WaveDivider className="h-16 -mb-px text-primary md:h-24" />
      {/* Decorative floral/botanical background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="leaf-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M20,50 C20,30 40,20 50,20 C60,20 80,30 80,50 C80,70 60,80 50,80 C40,80 20,70 20,50 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M50,20 L50,80" fill="none" stroke="currentColor" strokeWidth="2" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#leaf-pattern)" className="text-[#DDE8C8]" />
        </svg>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pt-16">
        <Reveal>
          <div className="bg-card/95 backdrop-blur-md max-w-4xl mx-auto rounded-[3rem] p-10 md:p-16 border-4 border-white text-center shadow-xl">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-secondary rounded-full text-white mb-8 shadow-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
                <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
                <line x1="6" y1="1" x2="6" y2="4"></line>
                <line x1="10" y1="1" x2="10" y2="4"></line>
                <line x1="14" y1="1" x2="14" y2="4"></line>
              </svg>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display text-primary mb-6">Let's Plan Something Delicious</h2>
            <p className="text-lg md:text-xl text-foreground/80 mb-10 max-w-2xl mx-auto">
              Ready to bring the authentic taste of Pakistan to your next event? Contact us today for a custom menu and quote.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/quote" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-8 h-14 text-lg shadow-md group cursor-pointer">
                  Request a Quote
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              {config.phone && <a href={`tel:${config.phone.replace(/[^0-9+]/g, '')}`} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full bg-white text-primary border-transparent hover:bg-muted font-bold px-8 h-14 text-lg shadow-sm cursor-pointer">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
              </a>}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
