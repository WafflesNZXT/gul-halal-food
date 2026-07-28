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
  const entrance = shouldReduceMotion ? { duration: 0 } : undefined;

  return (
    <section className="pt-28 md:pt-32 pb-0 overflow-hidden relative bg-background">
      {/* Background decorations */}
      <div className="absolute top-20 left-10 text-secondary/20 hidden md:block">
        <DecorativeFlourish className="w-16 h-16 rotate-45" />
      </div>
      <div className="absolute bottom-60 right-10 text-primary/10 hidden md:block">
        <DecorativeFlourish className="w-24 h-24 -rotate-12" />
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10 pb-12 md:pb-16 lg:min-h-[calc(100svh-4rem)] flex items-center">
        <div className="flex w-full flex-col lg:flex-row items-center gap-10 lg:gap-4 xl:gap-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-[45%] flex flex-col items-center lg:items-start text-center lg:text-left pt-4 lg:pt-8">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={entrance ?? { duration: 0.5 }}
              className="w-full max-w-[22rem] text-[2.25rem] sm:text-5xl md:max-w-none md:text-6xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] text-primary"
            >
              <span className="md:hidden">
                Homemade <br />
                Pakistani Food, <br />
                Made with <span className="text-secondary inline-flex items-center gap-1">Love <HeartSparkle className="hidden h-7 w-7 text-secondary sm:block" /></span>
              </span>
              <span className="hidden md:inline">
                Homemade Pakistani <br />
                Food, Made with <span className="text-secondary inline-flex items-center gap-2">Love <HeartSparkle className="h-10 w-10 lg:h-12 lg:w-12 text-secondary" /></span>
              </span>
            </motion.h1>
            
            {/* Hand-drawn underline SVG */}
            <motion.svg 
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={entrance ?? { duration: 0.8, delay: 0.3 }}
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
              transition={entrance ?? { duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-foreground/80 max-w-xl mb-8 leading-relaxed font-sans"
            >
              Delicious Pakistani halal catering for your special moments. From family gatherings to big celebrations — we're here to help.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={entrance ?? { duration: 0.5, delay: 0.4 }}
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
              transition={entrance ?? { duration: 0.5, delay: 0.6 }}
            >
              <TrustFeatures />
            </motion.div>
          </div>

          {/* Right Image Composition */}
          <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={entrance ?? { duration: 0.7 }}
              className="relative w-full max-w-[690px] px-2 sm:px-5 lg:px-0"
            >
              <HeroArch />
              <div className="absolute left-[7%] top-[17%] h-5 w-5 text-secondary/80" aria-hidden="true"><HeartSparkle className="h-full w-full" /></div>
              <div className="absolute right-[7%] top-[20%] text-secondary" aria-hidden="true"><DecorativeFlourish className="h-7 w-7 rotate-12" /></div>
              <div className="absolute right-[10%] bottom-[23%] h-5 w-5 text-secondary/70" aria-hidden="true"><HeartSparkle className="h-full w-full" /></div>
              <div className="relative z-10"><HeroFoodIllustration /></div>

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
      <div className="w-full flex flex-col relative z-20 -mt-2">
        <WaveDivider className="text-primary h-16 md:h-24 -mb-px" />
        <div className="bg-primary text-center pb-9 pt-3 md:pb-11 md:pt-4 flex flex-col items-center justify-center gap-3 w-full">
          <div className="flex max-w-[min(100%,58rem)] items-center justify-center gap-3 px-4 sm:gap-5">
             <DecorativeFlourish className="shrink-0 text-secondary w-5 h-5 md:w-6 md:h-6 rotate-180" />
             <span className="text-white/95 font-display font-bold text-xl leading-tight md:text-3xl tracking-wide">Bringing people together, one meal at a time.</span>
             <DecorativeFlourish className="shrink-0 text-secondary w-5 h-5 md:w-6 md:h-6" />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroArch() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="0 0 720 650" className="absolute inset-0 h-full w-full overflow-visible text-primary/35" preserveAspectRatio="xMidYMid meet">
      <path d="M96 615V300c0-82 59-121 135-148 58-21 104-66 129-139 25 73 71 118 129 139 76 27 135 66 135 148v315" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M123 615V314c0-59 43-90 113-115 59-21 101-69 124-125 23 56 65 104 124 125 70 25 113 56 113 115v301" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="5 9" />
      <g fill="currentColor" opacity="0.13"><path d="M166 563h388v-36h-26v-36h-22v36h-33v-69l-20-22-20 22v69h-46v-96l-27-32-27 32v96h-46v-69l-20-22-20 22v69h-33v-36h-22v36h-26z" /><path d="M250 495c0-26 17-43 39-50 22 7 39 24 39 50h-78zm142 0c0-26 17-43 39-50 22 7 39 24 39 50h-78z" /></g>
      <path d="M100 618c93-21 159-12 260 2 112 15 196 11 264-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </svg>
  );
}
