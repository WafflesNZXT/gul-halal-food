import React, { useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ShoppingBasket, Check, Minus, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { QuoteCTA } from "@/components/QuoteCTA";
import { DishImage } from "@/components/DishImage";
import { menu } from "@/data/menu";
import type { ExtraOptionGroup } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { SpiceLevel } from "@/components/SpiceLevel";
import { SpiceLevelSelector } from "@/components/SpiceLevelSelector";
import { useCart } from "@/contexts/CartContext";
import { cartItemKey } from "@/contexts/CartContext";
import type { SpiceLevelValue } from "@/types/cart";

export default function DishDetail() {
  const [, params] = useRoute("/menu/:slug");
  const dish = menu.find((item) => item.slug === params?.slug);

  if (!dish) {
    return (
      <Layout>
        <section className="px-4 pb-24 pt-36 text-center">
          <h1 className="text-4xl text-primary">Dish not found</h1>
          <Link
            href="/menu"
            className="mt-6 inline-block font-bold text-primary underline"
          >
            Back to the menu
          </Link>
        </section>
      </Layout>
    );
  }

  return <DishDetailContent slug={dish.slug} />;
}

function DishDetailContent({ slug }: { slug: string }) {
  const dish = menu.find((item) => item.slug === slug)!;
  const { addItem, openCart } = useCart();

  const canCustomiseSpice = dish.spiceCustomizable !== false && dish.spiceLevel > 0;
  const hasProteinOptions = (dish.proteinOptions?.length ?? 0) > 0;
  const hasExtraOptions = (dish.extraOptions?.length ?? 0) > 0;

  const defaultSpice = (dish.spiceLevel === 0
    ? 0
    : dish.spiceLevel >= 1 && dish.spiceLevel <= 3
      ? dish.spiceLevel
      : 2) as SpiceLevelValue;

  const [selectedProtein, setSelectedProtein] = useState<string | null>(null);
  const [selectedSpice, setSelectedSpice] = useState<SpiceLevelValue | null>(
    canCustomiseSpice ? null : defaultSpice
  );
  const [peopleCount, setPeopleCount] = useState(1);
  const [addedFeedback, setAddedFeedback] = useState(false);
  const [extras, setExtras] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  /** Whether an extra option group should be rendered right now */
  function isExtraVisible(group: ExtraOptionGroup): boolean {
    if (!group.showWhen) return true;
    return extras[group.showWhen.field] === group.showWhen.value;
  }

  /** Update an extras field, clearing any dependent conditional fields */
  function setExtraValue(field: string, value: string) {
    setExtras((prev) => {
      const next = { ...prev, [field]: value };
      // Clear values whose showWhen condition is no longer satisfied
      if (dish.extraOptions) {
        for (const group of dish.extraOptions) {
          if (
            group.showWhen &&
            next[group.showWhen.field] !== group.showWhen.value
          ) {
            delete next[group.id];
          }
        }
      }
      return next;
    });
  }

  /** Required visible extra groups that have not yet been filled */
  const pendingExtraGroups = (dish.extraOptions ?? []).filter((g) => {
    if (!isExtraVisible(g)) return false;
    if (g.required === false) return false;
    return !extras[g.id];
  });

  const proteinError = hasProteinOptions && selectedProtein === null;
  const spiceError = canCustomiseSpice && selectedSpice === null;
  const canAdd =
    !proteinError && !spiceError && pendingExtraGroups.length === 0;

  const handleAddToCart = () => {
    if (!canAdd) {
      setShowErrors(true);
      return;
    }
    const effectiveSpice = (selectedSpice ?? defaultSpice) as SpiceLevelValue;
    const proteinLabel =
      dish.proteinOptions?.find((p) => p.id === selectedProtein)?.label;

    // Only persist extras that are currently visible (i.e. relevant)
    const persistedExtras: Record<string, string> = {};
    for (const group of dish.extraOptions ?? []) {
      if (isExtraVisible(group) && extras[group.id]) {
        persistedExtras[group.id] = extras[group.id];
      }
    }

    const item = {
      config: {
        menuItemId: dish.id,
        proteinChoice: selectedProtein ?? undefined,
        spiceLevel: effectiveSpice,
        extras: Object.keys(persistedExtras).length > 0 ? persistedExtras : undefined,
      },
      quantity: peopleCount,
      name: dish.name,
      image: dish.image,
      pricingLabel: dish.pricingLabel ?? dish.price,
      basePrice: dish.basePrice,
      proteinLabel,
    };

    addItem(item);
    setAddedFeedback(true);
    openCart();
    setTimeout(() => setAddedFeedback(false), 2000);
  };

  const displaySpice = selectedSpice ?? dish.spiceLevel;
  const customizationLabel = dish.customizationLabel ?? "Choose your protein";

  return (
    <Layout>
      <section className="bg-background px-4 pb-20 pt-32 md:px-6 md:pt-40">
        <div className="container mx-auto max-w-6xl">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 font-bold text-primary hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft size={18} />
            Back to full menu
          </Link>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <DishImage
              src={dish.image}
              alt={dish.name}
              className="aspect-[4/3] w-full rounded-t-[36%] rounded-b-3xl border-2 border-primary/25 object-contain p-6 shadow-xl"
            />

            <div>
              <p className="font-bold uppercase tracking-[0.16em] text-secondary">
                Pakistani catering dish
              </p>
              <h1 className="mt-3 text-5xl text-primary md:text-6xl">
                {dish.name}
              </h1>
              <p className="mt-5 text-xl leading-relaxed text-foreground/80">
                {dish.shortDescription ?? dish.description}
              </p>
              <p className="hidden sm:block mt-4 leading-relaxed text-foreground/75">
                {dish.longDescription ?? dish.description}
              </p>

              {/* Suggested spice level (informational) */}
              {dish.spiceLevel > 0 && (
                <div className="mt-7 flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground/60">
                    Suggested:
                  </span>
                  <SpiceLevel level={dish.spiceLevel} />
                  <span className="text-sm text-foreground/60">
                    Spice level {dish.spiceLevel} of 3
                  </span>
                </div>
              )}

              {/* Spice customisation selector */}
              {canCustomiseSpice && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    Your spice level{" "}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </p>
                  <SpiceLevelSelector
                    value={selectedSpice}
                    onChange={setSelectedSpice}
                    name={`dish-spice-${dish.id}`}
                  />
                  {showErrors && spiceError && (
                    <p className="text-xs text-destructive" role="alert">
                      Please choose a spice level.
                    </p>
                  )}
                </div>
              )}

              {/* Protein / customization selector */}
              {hasProteinOptions && (
                <div className="mt-5 space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    {customizationLabel}{" "}
                    <span className="text-destructive" aria-hidden="true">*</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {dish.proteinOptions!.map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedProtein(opt.id)}
                        className={`rounded-full px-4 py-2 border font-medium text-sm transition-colors ${
                          selectedProtein === opt.id
                            ? "bg-primary/10 border-primary text-primary font-semibold"
                            : "bg-card border-border text-foreground/70 hover:border-primary/50 hover:text-primary"
                        }`}
                        aria-pressed={selectedProtein === opt.id}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {showErrors && proteinError && (
                    <p className="text-xs text-destructive" role="alert">
                      Please make a selection.
                    </p>
                  )}
                </div>
              )}

              {/* Extra option groups */}
              {hasExtraOptions &&
                dish.extraOptions!.map((group) => {
                  if (!isExtraVisible(group)) return null;

                  const isRequired = group.required !== false;
                  const hasError =
                    showErrors && isRequired && !extras[group.id];

                  return (
                    <div key={group.id} className="mt-5 space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        {group.label}{" "}
                        {isRequired && (
                          <span className="text-destructive" aria-hidden="true">
                            *
                          </span>
                        )}
                      </p>

                      {group.type === "boolean" ? (
                        <div className="flex flex-wrap gap-2">
                          {(["yes", "no"] as const).map((val) => (
                            <button
                              key={val}
                              onClick={() => setExtraValue(group.id, val)}
                              className={`rounded-full px-4 py-2 border font-medium text-sm transition-colors ${
                                extras[group.id] === val
                                  ? "bg-primary/10 border-primary text-primary font-semibold"
                                  : "bg-card border-border text-foreground/70 hover:border-primary/50 hover:text-primary"
                              }`}
                              aria-pressed={extras[group.id] === val}
                            >
                              {val === "yes" ? "Yes" : "No"}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {group.options!.map((opt) => (
                            <button
                              key={opt.id}
                              onClick={() => setExtraValue(group.id, opt.id)}
                              title={opt.description}
                              className={`rounded-full px-4 py-2 border font-medium text-sm transition-colors ${
                                extras[group.id] === opt.id
                                  ? "bg-primary/10 border-primary text-primary font-semibold"
                                  : "bg-card border-border text-foreground/70 hover:border-primary/50 hover:text-primary"
                              }`}
                              aria-pressed={extras[group.id] === opt.id}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}

                      {hasError && (
                        <p className="text-xs text-destructive" role="alert">
                          Please make a selection.
                        </p>
                      )}
                    </div>
                  );
                })}

              {/* People count stepper */}
              <div className="mt-5 space-y-2">
                <label
                  htmlFor={`people-count-${dish.id}`}
                  className="text-sm font-semibold text-foreground"
                >
                  How many people is this for?
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPeopleCount((n) => Math.max(1, n - 1))}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors disabled:opacity-40 shrink-0"
                    aria-label="Decrease people count"
                    disabled={peopleCount <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  <div className="flex items-center gap-1.5">
                    <input
                      id={`people-count-${dish.id}`}
                      type="number"
                      min={1}
                      value={peopleCount}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val >= 1) setPeopleCount(val);
                        else if (e.target.value === "") setPeopleCount(1);
                      }}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setPeopleCount(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-16 text-center text-base font-semibold rounded-xl border border-border bg-background px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      aria-label="Number of people"
                    />
                    <span className="text-sm text-foreground/60 whitespace-nowrap">
                      {peopleCount === 1 ? "person" : "people"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPeopleCount((n) => n + 1)}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors shrink-0"
                    aria-label="Increase people count"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <p className="text-xs text-foreground/55">
                  Catering portion sized for this many guests.
                </p>
              </div>

              {/* Flavor highlights */}
              <div className="mt-7 rounded-2xl border border-border bg-card p-5">
                <h2 className="text-2xl text-primary">Flavor highlights</h2>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {(dish.flavorHighlights ?? dish.ingredients ?? []).map(
                    (item) => (
                      <li
                        key={item}
                        className="rounded-full bg-muted px-3 py-1 text-sm font-semibold"
                      >
                        {item}
                      </li>
                    )
                  )}
                </ul>
                {dish.servingNotes && (
                  <p className="mt-4 text-foreground/75">{dish.servingNotes}</p>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="font-bold text-secondary">
                  {dish.pricingLabel ?? dish.price}
                </span>
                <Button
                  onClick={handleAddToCart}
                  className={`rounded-full font-bold transition-colors ${
                    addedFeedback
                      ? "bg-green-600 hover:bg-green-600 text-white"
                      : ""
                  }`}
                  aria-label={
                    addedFeedback
                      ? "Added to order"
                      : `Add ${dish.name} to order`
                  }
                >
                  {addedFeedback ? (
                    <>
                      <Check size={16} className="mr-2" />
                      Added to order
                    </>
                  ) : (
                    <>
                      <ShoppingBasket size={16} className="mr-2" />
                      Add to order
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <QuoteCTA />
    </Layout>
  );
}
