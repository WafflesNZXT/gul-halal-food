import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { menu } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { QuoteCTA } from "@/components/QuoteCTA";
import { cn } from "@/lib/utils";

export default function Menu() {
  const categories = [
    "All",
    "Rice Dishes",
    "Curries",
    "Meat Specialties",
    "Vegetarian",
    "Appetizers",
    "Breads & Sides",
    "Desserts",
  ];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  return (
    <Layout>
      <PageHeader
        title="Our Authentic Menu"
        description="Explore our rich, traditional Pakistani dishes made with love, fresh ingredients, and whole spices."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">

          {/* Category filter tabs
              Mobile: horizontally scrollable single row with shrink-0 pills
              Desktop: wrapping centered row */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-12"
            role="group"
            aria-label="Filter menu by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "shrink-0 px-5 py-3 rounded-full font-semibold transition-all duration-300 text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-card text-foreground/70 hover:bg-muted hover:text-primary border border-border"
                )}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu grid
              Mobile  (< sm, < 640px) : 2-column compact cards — gap-3
              Tablet  (sm–lg)         : 2-column full cards   — gap-6
              Desktop (lg+)           : 3-column full cards   — gap-8  */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
            {filteredMenu.map((item, idx) => (
              <Reveal key={item.id} delay={Math.min(idx * 0.05, 0.3)}>
                <MenuCard item={item} />
              </Reveal>
            ))}

            {filteredMenu.length === 0 && (
              <div className="col-span-full py-20 text-center text-foreground/60 text-lg">
                No items found in this category yet.
              </div>
            )}
          </div>
        </div>
      </section>

      <QuoteCTA />
    </Layout>
  );
}
