import React from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { testimonials } from "@/data/testimonials";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Star, Quote } from "lucide-react";

export default function TestimonialsPage() {
  return (
    <Layout>
      <PageHeader 
        title="Client Reviews" 
        description="Don't just take our word for it. Hear from the families and organizations we've had the pleasure of serving over the years."
      />
      
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-card p-8 rounded-[2rem] border border-border shadow-sm hover:shadow-md transition-shadow relative mt-6 h-full flex flex-col">
                <div className="absolute -top-6 left-8 bg-accent text-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">
                  <Quote size={20} fill="currentColor" />
                </div>
                
                <div className="flex gap-1 mb-4 mt-2">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={18} className="text-accent fill-accent" />
                  ))}
                </div>
                
                <p className="text-foreground/80 italic text-lg leading-relaxed flex-1 mb-6">
                  "{t.content}"
                </p>
                
                <div className="border-t border-border pt-4 mt-auto">
                  <h4 className="font-display text-lg text-primary">{t.name}</h4>
                  <p className="text-sm text-foreground/60">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <QuoteCTA />
    </Layout>
  );
}
