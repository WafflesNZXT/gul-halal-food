import React from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { FeaturedMenu } from "@/components/FeaturedMenu";
import { CateringServices } from "@/components/CateringServices";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { QuoteCTA } from "@/components/QuoteCTA";
import { Link } from "wouter";

// Homepage now serves as a preview of all sections
export default function Home() {
  return (
    <Layout>
      <Hero />
      
      {/* Featured Menu Preview */}
      <div className="relative pb-16 pt-8 bg-background">
        <FeaturedMenu />
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
          <Link href="/menu" className="font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md border border-border">
            View Full Menu →
          </Link>
        </div>
      </div>
      
      {/* Catering Services Preview */}
      <div className="relative pb-16 pt-8 bg-card/50">
        <CateringServices />
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
          <Link href="/catering" className="font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md border border-border">
            Explore Catering Services →
          </Link>
        </div>
      </div>
      
      {/* About Preview */}
      <div className="relative pb-16 pt-8 bg-background overflow-hidden">
        <About />
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
          <Link href="/about" className="font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md border border-border">
            Read Our Story →
          </Link>
        </div>
      </div>
      
      {/* Gallery Preview */}
      <div className="relative pb-16 pt-8 bg-background">
        <Gallery />
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-[20]">
          <Link href="/gallery" className="font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md border border-border">
            View Full Gallery →
          </Link>
        </div>
      </div>
      
      {/* Testimonials Preview */}
      <div className="relative pb-16 pt-8 bg-card/30">
        <Testimonials />
        <div className="absolute bottom-10 left-0 w-full flex justify-center z-20">
          <Link href="/testimonials" className="font-bold text-primary hover:text-secondary transition-colors flex items-center gap-2 bg-card px-6 py-3 rounded-full shadow-md border border-border">
            Read More Reviews →
          </Link>
        </div>
      </div>

      <QuoteCTA />
    </Layout>
  );
}
