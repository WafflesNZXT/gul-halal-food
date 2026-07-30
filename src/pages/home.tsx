import React from "react";
import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { FeaturedMenu } from "@/components/FeaturedMenu";
import { IngredientCare } from "@/components/IngredientCare";
import { CateringServices } from "@/components/CateringServices";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Testimonials } from "@/components/Testimonials";
import { QuoteCTA } from "@/components/QuoteCTA";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <FeaturedMenu />
      <IngredientCare />
      <CateringServices />
      <About />
      <Gallery preview />
      <Testimonials />
      <QuoteCTA />
    </Layout>
  );
}
