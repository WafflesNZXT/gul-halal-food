import React from "react";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const careSteps = [
  {
    title: "Hand-picked ingredients",
    description:
      "We choose the meat, produce, rice, and spices for each catering order with thoughtful attention.",
  },
  {
    title: "Careful from storage to prep",
    description:
      "Ingredients are stored and prepared with care before they become part of your meal.",
  },
  {
    title: "Respect in every dish",
    description:
      "From the first preparation step to serving, we treat every ingredient with the same care we give our own family table.",
  },
];

export function IngredientCare() {
  return (
    <section className="bg-card/50 py-16 md:py-20">
      <div className="container mx-auto px-4 md:px-6">
        <Reveal>
          <SectionHeading
            title="Ingredients Chosen with Care"
            subtitle="Authentic Pakistani meals begin with ingredients handled thoughtfully at every step."
            className="mb-10 md:mb-12"
          />
        </Reveal>

        <div className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3 md:gap-6">
          {careSteps.map((step, index) => (
            <Reveal key={step.title} delay={index * 0.08}>
              <article className="h-full rounded-3xl border border-border bg-background p-6 text-center shadow-sm md:p-7">
                <span aria-hidden="true" className="mx-auto mb-4 block h-2.5 w-2.5 rounded-full bg-secondary" />
                <h3 className="mb-3 text-xl text-primary">{step.title}</h3>
                <p className="leading-relaxed text-foreground/80">{step.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
