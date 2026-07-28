import React from "react";
import { SectionHeading } from "./SectionHeading";
import { MenuCard } from "./MenuCard";
import { Reveal } from "./Reveal";
import { menu } from "@/data/menu";
import { Link } from "wouter";

// Specific dishes to feature on the homepage
const FEATURED_SLUGS = ["biryani", "haleem", "chicken-karahi", "keer"];

export function FeaturedMenu() {
  const featuredItems = FEATURED_SLUGS
    .map((slug) => menu.find((item) => item.slug === slug))
    .filter(Boolean) as typeof menu;

  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <SectionHeading 
            title="A Taste of Home" 
            subtitle="Discover our signature dishes, crafted with traditional recipes and authentic spices to bring the true taste of Pakistan to your event."
            className="mb-12"
          />
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {featuredItems.map((item, idx) => (
            <Reveal key={item.id} delay={idx * 0.08}>
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <div className="mt-10 text-center">
            <Link href="/menu" className="font-bold text-primary underline-offset-4 hover:text-secondary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              View Full Menu →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
