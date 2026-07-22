import React, { useState } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { menu } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { QuoteCTA } from "@/components/QuoteCTA";
import { cn } from "@/lib/utils";

export default function Menu() {
  const categories = ["All", "Rice Dishes", "Curries", "Meat Specialties", "Vegetarian", "Appetizers", "Breads & Sides", "Desserts"];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu = activeCategory === "All" 
    ? menu 
    : menu.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <PageHeader 
        title="Our Authentic Menu" 
        description="Explore our rich, traditional Pakistani dishes made with love, fresh ingredients, and whole spices."
      />
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          
          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-6 py-2.5 rounded-full font-semibold transition-all duration-300",
                  activeCategory === cat 
                    ? "bg-primary text-primary-foreground shadow-md scale-105" 
                    : "bg-card text-foreground/70 hover:bg-muted hover:text-primary border border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filteredMenu.map((item) => (
              <MenuCard key={item.id} item={item} />
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
