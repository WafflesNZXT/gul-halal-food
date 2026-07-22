import React from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { services } from "@/data/services";
import { ServiceCard } from "@/components/ServiceCard";
import { QuoteCTA } from "@/components/QuoteCTA";
import { SectionHeading } from "@/components/SectionHeading";

export default function Catering() {
  return (
    <Layout>
      <PageHeader 
        title="Catering Services" 
        description="From intimate family dinners to grand wedding receptions, we scale our authentic recipes to match your celebration without compromising on flavor."
      />
      
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <SectionHeading 
            title="Planning Made Simple" 
            subtitle="We handle the food so you can focus on making memories."
            className="mb-16"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform">1</div>
              <h3 className="text-2xl font-display text-primary mb-3">Request a Quote</h3>
              <p className="text-foreground/80 leading-relaxed">Tell us about your event date, venue, and guest count. We'll check our availability and get right back to you.</p>
            </div>
            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform">2</div>
              <h3 className="text-2xl font-display text-primary mb-3">Customize Your Menu</h3>
              <p className="text-foreground/80 leading-relaxed">Work with our culinary team to design the perfect spread, ensuring dietary needs and spice levels are just right.</p>
            </div>
            <div className="text-center flex flex-col items-center group">
              <div className="w-20 h-20 bg-[#DDE8C8] text-primary rounded-full flex items-center justify-center text-2xl font-bold shadow-lg mb-6 group-hover:scale-110 transition-transform">3</div>
              <h3 className="text-2xl font-display text-primary mb-3">Enjoy Your Event</h3>
              <p className="text-foreground/80 leading-relaxed">We arrive on time, set up beautifully, and serve your guests with warm Pakistani hospitality.</p>
            </div>
          </div>
        </div>
      </section>

      <QuoteCTA />
    </Layout>
  );
}
