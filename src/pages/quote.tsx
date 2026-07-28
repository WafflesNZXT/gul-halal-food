import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { PageHeader } from "@/components/PageHeader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UtensilsCrossed, Trash2 } from "lucide-react";
import { clearCartAfterSuccessfulSubmission, submitOrder } from "@/lib/order";
import type { Order, OrderSubmissionResult } from "@/lib/order";
import { useCart, cartItemKey } from "@/contexts/CartContext";
import { SpiceLevel } from "@/components/SpiceLevel";
import type { CartItem } from "@/types/cart";
import { menu } from "@/data/menu";

const formSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  eventDate: z.string().min(1, "Please select an event date"),
  eventType: z.string().min(1, "Please select an event type"),
  venue: z.string().min(2, "Please enter a venue or city"),
  dietaryNeeds: z.string().optional(),
  website: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

/** Build a human-readable dish name including all configuration */
function buildDishName(item: CartItem): string {
  const menuItem = menu.find((m) => m.id === item.config.menuItemId);
  const parts: string[] = [item.name];

  if (item.proteinLabel) parts.push(`(${item.proteinLabel})`);

  // Include extra option selections
  if (item.config.extras && menuItem?.extraOptions) {
    for (const group of menuItem.extraOptions) {
      const value = item.config.extras[group.id];
      if (!value) continue;
      if (group.type === "boolean") {
        if (value === "yes") parts.push(`+${group.label}`);
      } else {
        const opt = group.options?.find((o) => o.id === value);
        if (opt) parts.push(opt.label);
      }
    }
  }

  // Include spice level for customisable items
  if (menuItem?.spiceCustomizable !== false && (menuItem?.spiceLevel ?? 0) > 0) {
    const spiceLabels: Record<number, string> = { 1: "Mild", 2: "Medium", 3: "Hot" };
    parts.push(`— ${spiceLabels[item.config.spiceLevel] ?? "Medium"} spice`);
  }

  if (item.quantity > 1) parts.push(`×${item.quantity} people`);

  return parts.join(" ");
}

export default function Quote() {
  const [submissionResult, setSubmissionResult] =
    useState<OrderSubmissionResult | null>(null);

  const { items, removeItem, updateQty, itemCount, clearCart } = useCart();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    const result = await submitOrder({
      customerName: data.fullName,
      customerEmail: data.email,
      customerPhone: data.phone,
      eventDate: data.eventDate,
      eventType: data.eventType,
      venue: data.venue,
      dietaryNeeds: data.dietaryNeeds,
      website: data.website,
      items: items.map((item) => ({ ...item.config, peopleCount: item.quantity })),
    });
    if (result.status === "success") {
      clearCartAfterSuccessfulSubmission(result, clearCart);
      try {
        localStorage.setItem("gul-latest-order", JSON.stringify({ reference: result.order.reference, statusUrl: result.order.statusUrl }));
      } catch {
        // Convenience-only storage; it contains no customer contact information.
      }
    }
    setSubmissionResult(result);
  };

  return (
    <Layout>
      <PageHeader
        title="Request a Quote"
        description="Let's craft the perfect menu for your event."
      />

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-[3rem] border border-border shadow-lg relative overflow-hidden">
            {/* Decorative background accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/4" />

            {submissionResult?.status === "success" ? (
              <OrderConfirmation
                order={submissionResult.order}
              />
            ) : (
              <>
                <div className="flex items-center gap-4 mb-10 pb-8 border-b border-border/50">
                  <div className="w-14 h-14 bg-secondary text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                    <UtensilsCrossed size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-display text-primary">
                      Event Details
                    </h2>
                    <p className="text-foreground/70">
                      Fill out the form below for an accurate quote.
                    </p>
                  </div>
                </div>

                {submissionResult?.status === "error" && (
                  <div
                    role="alert"
                    className="mb-8 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-foreground"
                  >
                    {submissionResult.message}
                  </div>
                )}

                <form
                  noValidate
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-8 relative z-10"
                >
                  {/* Cart summary */}
                  {items.length > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">
                        Your Selected Dishes
                      </h3>
                      <p className="text-xs text-foreground/60">
                        Final pricing will be confirmed with your catering quote.
                      </p>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <CartSummaryLine
                            key={cartItemKey(item.config)}
                            item={item}
                            onRemove={() => removeItem(cartItemKey(item.config))}
                            onQtyChange={(delta) =>
                              updateQty(cartItemKey(item.config), delta)
                            }
                          />
                        ))}
                      </div>
                      <OrderTotal items={items} />
                    </div>
                  )}

                  {/* Contact Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="fullName"
                          className="text-sm font-semibold text-foreground"
                        >
                          Full Name *
                        </label>
                        <Input
                          id="fullName"
                          placeholder="Jane Doe"
                          className={`h-12 rounded-xl bg-background border-border ${errors.fullName ? "border-destructive" : ""}`}
                          {...register("fullName")}
                        />
                        {errors.fullName && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.fullName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="email"
                          className="text-sm font-semibold text-foreground"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="jane@example.com"
                          className={`h-12 rounded-xl bg-background border-border ${errors.email ? "border-destructive" : ""}`}
                          {...register("email")}
                        />
                        {errors.email && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.email.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="phone"
                          className="text-sm font-semibold text-foreground"
                        >
                          Phone Number *
                        </label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter a phone number"
                          className={`h-12 rounded-xl bg-background border-border md:w-1/2 ${errors.phone ? "border-destructive" : ""}`}
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.phone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Event Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">
                      Event Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label
                          htmlFor="eventDate"
                          className="text-sm font-semibold text-foreground"
                        >
                          Event Date *
                        </label>
                        <Input
                          id="eventDate"
                          type="date"
                          className={`h-12 rounded-xl bg-background border-border ${errors.eventDate ? "border-destructive" : ""}`}
                          {...register("eventDate")}
                        />
                        {errors.eventDate && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.eventDate.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="eventType"
                          className="text-sm font-semibold text-foreground"
                        >
                          Event Type *
                        </label>
                        <select
                          id="eventType"
                          className={`flex h-12 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.eventType ? "border-destructive" : ""}`}
                          {...register("eventType")}
                        >
                          <option value="" disabled>
                            Select an event...
                          </option>
                          <option value="wedding">Wedding</option>
                          <option value="family">Family Gathering</option>
                          <option value="community">Community Event</option>
                          <option value="corporate">Corporate Event</option>
                          <option value="birthday">Birthday/Celebration</option>
                          <option value="other">Other</option>
                        </select>
                        {errors.eventType && (
                          <p className="text-destructive text-sm mt-1">
                            {errors.eventType.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor="venue"
                          className="text-sm font-semibold text-foreground"
                        >
                          Venue / City *
                        </label>
                        <Input
                          id="venue"
                          placeholder="e.g. Community Center, San Jose"
                          className={`h-12 rounded-xl bg-background border-border md:w-1/2 ${errors.venue ? "border-destructive" : ""}`}
                          {...register("venue")}
                        />
                        {errors.venue && <p className="text-destructive text-sm mt-1">{errors.venue.message}</p>}
                      </div>
                    </div>
                  </div>

                  {/* Dietary requirements */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-display text-foreground border-l-4 border-secondary pl-3">
                      Dietary Requirements
                    </h3>
                    <div className="space-y-2">
                      <label
                        htmlFor="dietaryNeeds"
                        className="text-sm font-semibold text-foreground"
                      >
                        Any dietary needs?
                      </label>
                      <Input
                        id="dietaryNeeds"
                        placeholder="E.g. Need 10 vegetarian portions, 5 gluten-free"
                        className="h-12 rounded-xl bg-background border-border"
                        {...register("dietaryNeeds")}
                      />
                      <p className="text-xs text-foreground/60 mt-1">
                        Gul Halal Food serves Pakistani halal catering.
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    {items.length > 0 && <QuickTotal items={items} />}
                    <Button
                      type="submit"
                      className="w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary/90 font-bold px-12 h-14 text-lg shadow-md sm:ml-auto cursor-pointer"
                    >
                      {itemCount > 0 ? "Request This Order" : "Place Order"}
                    </Button>
                  </div>
                  <input tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("website")} />
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

// ─── helpers for totals ───────────────────────────────────────────────────────

function calcTotal(items: CartItem[]) {
  let total = 0;
  let allPriced = true;
  for (const item of items) {
    if (typeof item.basePrice === "number") {
      total += item.basePrice * item.quantity;
    } else {
      allPriced = false;
    }
  }
  return { total, allPriced, anyPriced: total > 0 };
}

/** Breakdown table shown between dishes and contact info */
function OrderTotal({ items }: { items: CartItem[] }) {
  if (items.length === 0) return null;
  const { total, allPriced } = calcTotal(items);

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-4 space-y-2">
      <h4 className="text-sm font-bold text-foreground/70 uppercase tracking-wider mb-3">
        Order Summary
      </h4>

      {/* Per-item breakdown */}
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={cartItemKey(item.config)} className="flex items-baseline justify-between gap-3 text-sm">
            <span className="text-foreground/80 truncate">
              {item.name}
              {item.proteinLabel && (
                <span className="text-foreground/50"> ({item.proteinLabel})</span>
              )}
              <span className="text-foreground/45 ml-1">× {item.quantity}</span>
            </span>
            {typeof item.basePrice === "number" ? (
              <span className="font-semibold text-foreground shrink-0">
                ${(item.basePrice * item.quantity).toFixed(2)}
              </span>
            ) : (
              <span className="text-foreground/40 shrink-0 text-xs">Pricing pending</span>
            )}
          </div>
        ))}
      </div>

      {/* Divider + total */}
      <div className="pt-2 border-t border-border flex items-center justify-between">
        <span className="font-bold text-foreground">
          {allPriced ? "Total" : "Estimated Total"}
        </span>
        {total > 0 ? (
          <span className="font-bold text-lg text-primary">
            ${total.toFixed(2)}
            {!allPriced && <span className="text-xs font-normal text-foreground/50 ml-1">(partial)</span>}
          </span>
        ) : (
          <span className="text-sm text-foreground/50">Confirmed with quote</span>
        )}
      </div>
    </div>
  );
}

/** Compact total shown beside the submit button */
function QuickTotal({ items }: { items: CartItem[] }) {
  const { total, allPriced } = calcTotal(items);
  return (
    <div className="text-sm text-foreground/70">
      {total > 0 ? (
        <>
          <span>{allPriced ? "Total: " : "Est. total: "}</span>
          <span className="font-bold text-primary text-base">${total.toFixed(2)}</span>
          {!allPriced && <span className="text-xs ml-1">(partial)</span>}
        </>
      ) : (
        <span>Pricing will be confirmed with your quote</span>
      )}
    </div>
  );
}

// ─── Cart summary line inside the quote form ────────────────────────────────

function CartSummaryLine({
  item,
  onRemove,
  onQtyChange,
}: {
  item: CartItem;
  onRemove: () => void;
  onQtyChange: (delta: number) => void;
}) {
  const menuItem = menu.find((m) => m.id === item.config.menuItemId);

  // Local input state so user can type freely; committed on blur / Enter
  const [inputVal, setInputVal] = useState(String(item.quantity));
  useEffect(() => {
    setInputVal(String(item.quantity));
  }, [item.quantity]);

  const commitInput = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      const delta = parsed - item.quantity;
      if (delta !== 0) onQtyChange(delta);
    } else {
      setInputVal(String(item.quantity)); // reset invalid
    }
  };

  // Build extras display
  const extrasLines: string[] = [];
  if (item.config.extras && menuItem?.extraOptions) {
    for (const group of menuItem.extraOptions) {
      const value = item.config.extras[group.id];
      if (!value) continue;
      if (group.type === "boolean") {
        if (value === "yes") extrasLines.push(group.label);
      } else {
        const opt = group.options?.find((o) => o.id === value);
        if (opt) extrasLines.push(opt.label);
      }
    }
  }

  const showSpice =
    menuItem?.spiceCustomizable !== false && (menuItem?.spiceLevel ?? 0) > 0;

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-3 space-y-2.5">
      {/* Row 1: image · name/extras/spice · trash */}
      <div className="flex items-start gap-3">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-10 h-10 object-contain shrink-0 mt-0.5"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground leading-snug">
            {item.name}
            {item.proteinLabel && (
              <span className="font-normal text-foreground/60">
                {" "}({item.proteinLabel})
              </span>
            )}
          </p>
          {extrasLines.length > 0 && (
            <p className="text-xs text-foreground/55 mt-0.5">
              {extrasLines.join(" · ")}
            </p>
          )}
          {showSpice && (
            <div className="flex items-center gap-1.5 mt-0.5">
              <SpiceLevel level={item.config.spiceLevel} />
              <span className="text-xs text-foreground/50">
                {["", "Mild", "Medium", "Hot"][item.config.spiceLevel]} spice
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-foreground/35 hover:text-destructive transition-colors mt-0.5 shrink-0 cursor-pointer"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Row 2: stepper with typed input · price */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* − input + stepper */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onQtyChange(-1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm text-foreground/70 hover:bg-muted transition-colors cursor-pointer"
            aria-label="Decrease people count"
          >
            −
          </button>
          <input
            type="number"
            min={1}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={commitInput}
            onKeyDown={(e) => e.key === "Enter" && commitInput()}
            className="w-12 h-7 rounded-lg border border-border bg-background text-center text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            aria-label="Number of people"
          />
          <span className="text-sm text-foreground/60 whitespace-nowrap">
            {parseInt(inputVal, 10) === 1 ? "person" : "people"}
          </span>
          <button
            type="button"
            onClick={() => onQtyChange(1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-sm text-foreground/70 hover:bg-muted transition-colors cursor-pointer"
            aria-label="Increase people count"
          >
            +
          </button>
        </div>

        {/* Price */}
        {typeof item.basePrice === "number" ? (
          <span className="text-sm font-semibold text-primary shrink-0">
            ${(item.basePrice * item.quantity).toFixed(2)}
          </span>
        ) : (
          <span className="text-xs text-foreground/40 shrink-0">Pricing pending</span>
        )}
      </div>
    </div>
  );
}

// ─── Order confirmation ───────────────────────────────────────────────────────

function OrderConfirmation({ order }: { order: Order & { statusUrl: string } }) {
  return (
    <div className="py-12 text-center">
      <h2 className="text-4xl text-primary">Thank you</h2>
      <p className="mx-auto mt-4 max-w-lg text-foreground/75">
        Your order request has been received. Final availability and pricing will be confirmed separately.
      </p>
      <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-border bg-background p-5 text-left space-y-2">
        <p>
          <strong>Reference:</strong> {order.reference}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Event date:</strong> {order.eventDate}
        </p>
        {order.items.length > 0 && (
          <p>
            <strong>Dishes:</strong>{" "}
            {order.items.map((item) => item.name).join(", ")}
          </p>
        )}
      </div>
      <div className="mt-8 flex justify-center">
        <Button asChild><a href={order.statusUrl}>View order status</a></Button>
      </div>
    </div>
  );
}
