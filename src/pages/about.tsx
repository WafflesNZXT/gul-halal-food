import React from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { QuoteCTA } from "@/components/QuoteCTA";
import { config } from "@/data/config";
import logoImg from "@assets/image_1784700099561.png";

export default function About() {
  return (
    <Layout>
      <PageHeader 
        title="Our Family Story" 
        description={`Serving authentic Pakistani halal food since ${config.established}. Discover the heart and history behind our kitchen.`}
      />
      
      <section className="py-20 bg-background overflow-hidden relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative w-full max-w-lg aspect-square bg-card border-[12px] border-card shadow-2xl rounded-[3rem] overflow-hidden group">
                <div className="absolute inset-0 bg-muted/20 flex flex-col items-center justify-center p-12 text-center border border-border border-dashed m-6 rounded-2xl group-hover:bg-muted/30 transition-colors">
                  <img src={logoImg} alt="Gul Halal Food Logo" className="w-full max-w-[280px] h-auto object-contain mb-8 opacity-90 drop-shadow-md" />
                  <p className="font-display text-xl text-primary/70">A legacy of flavor and family</p>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6 text-foreground/80 text-lg leading-relaxed">
              <h2 className="text-3xl md:text-5xl font-display text-primary mb-6">Family Recipes, Shared with Love</h2>
              <p>
                Since {config.established}, {config.businessName} has been a cornerstone of our community's celebrations. What started as a small family kitchen sharing traditional recipes with neighbors has grown into a beloved catering service spanning the {config.serviceArea}.
              </p>
              <p>
                We believe that food is more than just sustenance—it's a way to show care, hospitality, and love. Every dish we prepare is rooted in authentic Pakistani culinary tradition, using the same spice blends and slow-cooking methods our grandparents taught us in Karachi.
              </p>
              <p>
                Whether we're serving 50 people or 500, we never compromise on quality or our 100% halal commitment. When you choose us for your event, you're not just getting a caterer; you're inviting our family to cook for yours.
              </p>

              <div className="grid grid-cols-2 gap-6 mt-10">
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center">
                  <span className="block text-4xl font-display text-secondary mb-2">35+</span>
                  <span className="text-sm font-bold text-foreground">Years of Experience</span>
                </div>
                <div className="bg-card p-6 rounded-3xl border border-border shadow-sm text-center">
                  <span className="block text-4xl font-display text-secondary mb-2">10k+</span>
                  <span className="text-sm font-bold text-foreground">Happy Guests Served</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <QuoteCTA />
    </Layout>
  );
}
