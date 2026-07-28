import React, { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { Link } from "wouter";
import { testimonials } from "@/data/testimonials";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const previewTestimonials = testimonials.slice(0, 3);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % previewTestimonials.length);
  };

  useEffect(() => {
    if (!isPaused && !shouldReduceMotion) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, previewTestimonials.length, shouldReduceMotion]);

  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <SectionHeading 
            title="Made with Love, Remembered with Joy" 
            subtitle="Don't just take our word for it. Hear from the families and organizations we've had the pleasure of serving."
            className="mb-16"
          />
        </Reveal>

        {/* Desktop Grid View */}
        <div className="hidden lg:grid grid-cols-3 gap-8">
          {previewTestimonials.map((t, idx) => (
            <Reveal key={t.id} delay={idx * 0.08}>
              <TestimonialCard testimonial={t} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link href="/testimonials" className="font-bold text-primary underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Read Testimonials →
            </Link>
          </div>
        </Reveal>

        {/* Mobile/Tablet Carousel View */}
        <div 
          className="lg:hidden relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div 
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {previewTestimonials.map((t) => (
              <div key={t.id} className="w-full shrink-0 px-4">
                <TestimonialCard testimonial={t} />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {previewTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={cn(
                  "w-3 h-3 rounded-full transition-colors cursor-pointer",
                  activeIndex === idx ? "bg-primary" : "bg-primary/20"
                )}
                aria-label={`Go to testimonial ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow relative mt-6 h-full flex flex-col">
      <div className="absolute -top-6 left-8 bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
        <Quote size={20} fill="currentColor" />
      </div>
      
      <div className="flex gap-1 mb-4 mt-2">
        {Array.from({ length: testimonial.rating ?? 0 }).map((_, i) => (
          <Star key={i} size={18} className="text-accent fill-accent" />
        ))}
      </div>
      
      <p className="text-foreground/80 italic text-lg leading-relaxed flex-1 mb-6">
        "{testimonial.content}"
      </p>
      
      <div className="border-t border-border pt-4 mt-auto">
        <h4 className="font-display text-lg text-primary">{testimonial.name}</h4>
        <p className="text-sm text-foreground/60">{testimonial.role}</p>
      </div>
    </div>
  );
}
