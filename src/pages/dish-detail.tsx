import React from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, Flame, ShoppingBasket } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuoteCTA } from "@/components/QuoteCTA";
import { DishImage } from "@/components/DishImage";
import { menu } from "@/data/menu";
import { Button } from "@/components/ui/button";

export default function DishDetail() {
  const [, params] = useRoute("/menu/:slug");
  const dish = menu.find((item) => item.slug === params?.slug);

  if (!dish) {
    return <Layout><section className="px-4 pb-24 pt-36 text-center"><h1 className="text-4xl text-primary">Dish not found</h1><Link href="/menu" className="mt-6 inline-block font-bold text-primary underline">Back to the menu</Link></section></Layout>;
  }

  return <Layout>
    <section className="bg-background px-4 pb-20 pt-32 md:px-6 md:pt-40">
      <div className="container mx-auto max-w-6xl">
        <Link href="/menu" className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"><ArrowLeft size={18} />Back to full menu</Link>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <DishImage src={dish.image} alt={dish.name} className="aspect-[4/3] w-full rounded-t-[36%] rounded-b-3xl border-2 border-primary/25 object-contain p-6 shadow-xl" />
          <div>
            <p className="font-bold uppercase tracking-[0.16em] text-secondary">Pakistani catering dish</p>
            <h1 className="mt-3 text-5xl text-primary md:text-6xl">{dish.name}</h1>
            <p className="mt-5 text-xl leading-relaxed text-foreground/80">{dish.shortDescription ?? dish.description}</p>
            <p className="mt-4 leading-relaxed text-foreground/75">{dish.longDescription ?? dish.description}</p>
            <div className="mt-7 flex items-center gap-2 text-secondary" aria-label={`Spice level ${dish.spiceLevel} out of 3`}><Flame aria-hidden="true" />{Array.from({ length: dish.spiceLevel }).map((_, index) => <Flame key={index} size={17} fill="currentColor" aria-hidden="true" />)}<span className="ml-2 font-bold text-foreground">Spice level {dish.spiceLevel} of 3</span></div>
            <div className="mt-7 rounded-2xl border border-border bg-card p-5"><h2 className="text-2xl text-primary">Flavor highlights</h2><ul className="mt-3 flex flex-wrap gap-2">{dish.ingredients?.map((ingredient) => <li key={ingredient} className="rounded-full bg-muted px-3 py-1 text-sm font-semibold">{ingredient}</li>)}</ul><p className="mt-4 text-foreground/75">{dish.servingNotes}</p></div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center"><span className="font-bold text-secondary">{dish.pricingLabel ?? dish.price}</span><Button asChild className="rounded-full"><Link href={`/quote?dish=${encodeURIComponent(dish.name)}`}><ShoppingBasket />Request this dish</Link></Button></div>
          </div>
        </div>
      </div>
    </section>
    <QuoteCTA />
  </Layout>;
}
