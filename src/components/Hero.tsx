import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, UtensilsCrossed, Star } from "lucide-react";
import { TrustFeatures } from "./TrustFeatures";
import { DecorativeFlourish, HeartSparkle, WaveDivider } from "./DecorativeFlourish";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { HeroFoodIllustration } from "./HeroFoodIllustration";

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const transition = shouldReduceMotion ? { duration: 0 } : undefined;

  return (
    <section className="pt-32 pb-0 overflow-hidden relative bg-background">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 text-secondary/20 hidden md:block">
        <DecorativeFlourish className="w-16 h-16 rotate-45" />
      </div>
      <div className="absolute bottom-60 right-10 text-primary/10 hidden md:block">
        <DecorativeFlourish className="w-24 h-24 -rotate-12" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pb-16 md:pb-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-[50%] xl:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-primary"
            >
              Homemade Pakistani <br className="hidden md:block" />
              Food, Made with <span className="text-secondary inline-flex items-center gap-2">Love <HeartSparkle className="w-10 h-10 lg:w-12 lg:h-12 text-secondary" /></span>
            </motion.h1>
            
            {/* Hand-drawn underline SVG */}
            <motion.svg 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-48 h-4 text-primary mt-2 mb-6" 
              viewBox="0 0 200 15" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M2 13C45.5 4.5 100.5 2 198 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
            </motion.svg>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-foreground/80 max-w-xl mb-8 leading-relaxed font-sans"
            >
              Delicious Pakistani halal catering for your special moments. From family gatherings to big celebrations — we're here to help.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <Link href="/quote" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-8 h-14 text-lg shadow-md hover:-translate-y-1 transition-transform">
                  <Calendar className="mr-2 h-5 w-5" />
                  Book Your Event
                </Button>
              </Link>
              <Link href="/menu" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full bg-card text-primary border-border hover:bg-muted font-bold px-8 h-14 text-lg shadow-sm">
                  <UtensilsCrossed className="mr-2 h-5 w-5" />
                  View Our Menu
                </Button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <TrustFeatures />
            </motion.div>
          </div>

          {/* Right Image Composition */}
          <div className="w-full lg:w-[50%] xl:w-[55%] relative flex justify-center lg:justify-end mt-8 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative w-full max-w-[600px]"
            >
              <HeroFoodIllustration />

              {/* Since 1985 badge */}
              <div className="absolute top-1/2 -left-8 bg-card px-4 py-2 rounded-xl shadow-lg border border-border flex items-center gap-2 z-20">
                <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-sm">Since 1985</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Green Wave Divider at the bottom seamlessly attached */}
      <div className="w-full flex flex-col relative z-20">
        <WaveDivider className="text-primary h-12 md:h-20" />
        <div className="bg-primary text-center pb-8 pt-2 -mt-[1px] flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex items-center gap-4">
             <DecorativeFlourish className="text-secondary w-5 h-5 md:w-6 md:h-6 rotate-180" />
             <span className="text-white/95 font-display font-bold text-xl md:text-3xl tracking-wide">Bringing people together, one meal at a time.</span>
             <DecorativeFlourish className="text-secondary w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}
