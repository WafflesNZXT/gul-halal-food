import React, { useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { menu, MenuItem } from "@/data/menu";
import { MenuCard } from "@/components/MenuCard";
import { Reveal } from "@/components/Reveal";
import { QuoteCTA } from "@/components/QuoteCTA";
import { cn } from "@/lib/utils";

const CATEGORY_ORDER = [
  "Rice Dishes",
  "Curries",
  "Meat Specialties",
  "Vegetarian",
  "Appetizers",
  "Breads & Sides",
  "Desserts",
];

export default function Menu() {
  const categories = ["All", ...CATEGORY_ORDER];
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredMenu =
    activeCategory === "All"
      ? menu
      : menu.filter((item) => item.category === activeCategory);

  // For mobile list: group by category when "All" selected
  const mobileGroups =
    activeCategory === "All"
      ? CATEGORY_ORDER.map((cat) => ({
          category: cat,
          items: filteredMenu.filter((item) => item.category === cat),
        })).filter((g) => g.items.length > 0)
      : [{ category: activeCategory, items: filteredMenu }];

  return (
    <Layout>
      <PageHeader
        title="Our Authentic Menu"
        description="Explore our rich, traditional Pakistani dishes made with love, fresh ingredients, and whole spices."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">

          {/* Category filter tabs */}
          <div
            className="flex flex-wrap justify-center gap-3 mb-10 sm:mb-12"
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

          {/* ── MOBILE list view (< sm) ─────────────────────────────────────── */}
          <div className="sm:hidden space-y-6">
            {mobileGroups.map((group) => (
              <div key={group.category}>
                {/* Category header */}
                {activeCategory === "All" && (
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-bold uppercase tracking-widest text-primary/70 shrink-0">
                      {group.category}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                )}

                {/* Item rows */}
                <div className="bg-card rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/40">
                  {group.items.map((item) => (
                    <MobileMenuRow key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ))}

            {filteredMenu.length === 0 && (
              <p className="py-16 text-center text-foreground/60">
                No items found in this category yet.
              </p>
            )}
          </div>

          {/* ── DESKTOP / tablet grid (sm+) ────────────────────────────────── */}
          <div className="hidden sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
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

function MobileMenuRow({ item }: { item: MenuItem }) {
  const href = item.featured
    ? `/menu/${item.slug}`
    : `/quote?dish=${encodeURIComponent(item.name)}`;

  return (
    <Link
      href={href}
      aria-label={`View ${item.name}`}
      className="flex items-center gap-3 px-4 py-3 active:bg-muted/60 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
    >
      {/* Circular dish image */}
      <div className="w-12 h-12 rounded-full bg-muted/30 border border-border/50 overflow-hidden shrink-0 flex items-center justify-center">
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="w-11 h-11 object-contain"
          />
        ) : (
          <span className="text-xl" aria-hidden="true">{item.icon}</span>
        )}
      </div>

      {/* Name */}
      <span className="font-semibold text-sm text-foreground leading-tight flex-1 min-w-0 line-clamp-2">
        {item.name}
      </span>

      {/* Dotted leader */}
      <div className="flex-shrink-0 w-8 border-b border-dotted border-foreground/25 mb-0.5 mx-1" />

      {/* Price */}
      <span className="text-sm font-bold text-secondary shrink-0 whitespace-nowrap">
        {item.price ?? "–"}
      </span>

      {/* Arrow */}
      <svg
        className="shrink-0 text-foreground/30 ml-0.5"
        width="14" height="14" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round"
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  );
}
