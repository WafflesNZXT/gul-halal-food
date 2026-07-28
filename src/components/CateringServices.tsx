import React from "react";
import { SectionHeading } from "./SectionHeading";
import { ServiceCard } from "./ServiceCard";
import { Reveal } from "./Reveal";
import { services } from "@/data/services";
import { Link } from "wouter";

export function CateringServices() {
  return (
    <section className="py-20 bg-card/50">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <SectionHeading 
            title="Made for Every Occasion" 
            subtitle="From intimate family dinners to grand wedding receptions, we scale our recipes to match your celebration without compromising on flavor."
            className="mb-12"
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service, idx) => (
            <Reveal key={service.id} delay={idx * 0.08}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link href="/quote" className="font-bold text-primary underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              Plan Your Event →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
