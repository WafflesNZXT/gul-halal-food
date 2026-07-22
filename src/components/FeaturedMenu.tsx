import React from "react";
import { SectionHeading } from "./SectionHeading";
import { MenuCard } from "./MenuCard";
import { menu } from "@/data/menu";
import { Button } from "@/components/ui/button";

import { Link } from "wouter";

export function FeaturedMenu() {
  return (
    <section className="py-20 bg-background relative z-10">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading 
          title="A Taste of Home" 
          subtitle="Discover our signature dishes, crafted with traditional recipes and authentic spices to bring the true taste of Pakistan to your event."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {menu.slice(0, 3).map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
