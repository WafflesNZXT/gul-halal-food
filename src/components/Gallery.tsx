import React, { useState } from "react";
import { gallery, GalleryCategory } from "@/data/gallery";
import { SectionHeading } from "./SectionHeading";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function Gallery() {
  const categories: GalleryCategory[] = ["All", "Food", "Weddings", "Family Events", "Catering Setups"];
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredGallery = gallery.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  ).slice(0, 4); // Preview: show only 4 items on homepage

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredGallery.length);
    }
  };
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredGallery.length) % filteredGallery.length);
    }
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <SectionHeading
          title="From Our Kitchen to Your Celebration"
          subtitle="Take a look at the delicious moments we've helped create."
          className="mb-10"
        />

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-6 py-2 rounded-full font-semibold transition-all duration-300",
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-card text-foreground/70 hover:bg-muted border border-border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Masonry-style Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {filteredGallery.map((item, index) => (
            <div
              key={item.id}
              onClick={() => openLightbox(index)}
              className={cn(
                "relative group cursor-pointer overflow-hidden rounded-2xl border border-border transition-transform hover:scale-[1.02]",
                item.placeholderColor,
                item.aspectRatio === "portrait" ? "row-span-2" : "",
                item.aspectRatio === "square" ? "col-span-1 row-span-1 sm:col-span-2 sm:row-span-2 md:col-span-1 md:row-span-1" : ""
              )}
            >
              {/* Placeholder pattern */}
              <div className="absolute inset-0 opacity-20 flex items-center justify-center pointer-events-none">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center">
                <Maximize2 className="text-white mb-3" size={28} />
                <span className="text-white font-display text-lg">{item.title}</span>
                <span className="text-white/80 text-sm mt-1 px-3 py-1 rounded-full bg-white/20">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
          onKeyDown={(e) => {
            if (e.key === "Escape") closeLightbox();
            if (e.key === "ArrowRight") nextImage(e as any);
            if (e.key === "ArrowLeft") prevImage(e as any);
          }}
          tabIndex={0}
          autoFocus
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-black/50 rounded-full p-2"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full hidden md:block"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={32} />
          </button>

          <div className="relative max-w-5xl w-full max-h-[80vh] flex flex-col items-center justify-center">
            <div className={cn(
              "w-full h-[60vh] rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden",
              filteredGallery[lightboxIndex].placeholderColor
            )}>
              <div className="flex flex-col items-center gap-3 text-primary/40">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="font-display text-xl">Photo coming soon</p>
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-2xl font-display text-white">{filteredGallery[lightboxIndex].title}</h3>
              <p className="text-white/60 mt-2">{filteredGallery[lightboxIndex].category}</p>
            </div>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/50 p-3 rounded-full hidden md:block"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      )}
    </section>
  );
}
