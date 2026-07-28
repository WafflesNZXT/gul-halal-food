import React from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { QuoteCTA } from "@/components/QuoteCTA";
import { config } from "@/data/config";

const logoImg = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/brand/gul-logo-full.webp`;

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
              <div className="w-full max-w-lg">
                <img src={logoImg} alt="Full Gul Halal Food official logo" className="w-full h-auto object-contain drop-shadow-md" />
                <p className="mt-5 text-center font-display text-xl text-primary/70">A legacy of flavor and family</p>
              </div>
            </div>

            <div className="w-full lg:w-1/2 space-y-6 text-foreground/80 text-lg leading-relaxed">
              <h2 className="text-3xl md:text-5xl font-display text-primary mb-6">Family Recipes, Shared with Love</h2>
              <p>
                Since {config.established}, {config.businessName} has shared Pakistani halal food for gatherings and celebrations.
              </p>
              <p>
                We believe that food is more than just sustenance—it's a way to show care, hospitality, and love. Every dish we prepare is rooted in Pakistani culinary tradition.
              </p>
              <p>
                When you choose us for your event, you're inviting our family to cook for yours.
              </p>

            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <QuoteCTA />
    </Layout>
  );
}
