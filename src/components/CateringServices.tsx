import React from "react";
import { SectionHeading } from "./SectionHeading";
import { ServiceCard } from "./ServiceCard";
import { services } from "@/data/services";

export function CateringServices() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="Made for Every Occasion" 
          subtitle="From intimate family dinners to grand wedding receptions, we scale our recipes to match your celebration without compromising on flavor."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
