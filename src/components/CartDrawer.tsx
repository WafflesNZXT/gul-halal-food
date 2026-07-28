import React from "react";
import { useLocation } from "wouter";
import { Minus, Plus, Trash2, ShoppingBasket } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart, cartItemKey } from "@/contexts/CartContext";
import { SpiceLevel } from "@/components/SpiceLevel";
import { SpiceLevelSelector } from "@/components/SpiceLevelSelector";
import type { CartItem } from "@/types/cart";
import type { SpiceLevelValue } from "@/types/cart";
import { menu } from "@/data/menu";

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQty,
    updateSpice,
    updateConfig,
  } = useCart();
  const [, navigate] = useLocation();

  const allPriced = items.every((i) => typeof i.basePrice === "number");
  const totalPeople = items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = allPriced
    ? items.reduce((sum, i) => sum + (i.basePrice ?? 0) * i.quantity, 0)
    : null;

  const handleRequestOrder = () => {
    closeCart();
    navigate("/quote?from=cart");
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0"
      >
        <SheetHeader className="px-5 py-4 border-b border-border shrink-0">
          <SheetTitle className="flex items-center gap-2 text-primary font-display text-xl">
            <ShoppingBasket size={20} />
            Your Order{" "}
            {items.length > 0 && (
              <span className="text-sm font-normal text-foreground/60 ml-1">
                ({items.length} {items.length === 1 ? "dish" : "dishes"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Item list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center text-foreground/50">
              <ShoppingBasket size={40} strokeWidth={1.2} />
              <p className="text-sm">Your order is empty.</p>
              <p className="text-xs">Browse the menu and add dishes you love.</p>
            </div>
          ) : (
            items.map((item) => (
              <CartLineItem
                key={cartItemKey(item.config)}
                item={item}
                onRemove={() => removeItem(cartItemKey(item.config))}
                onPeopleChange={(delta) =>
                  updateQty(cartItemKey(item.config), delta)
                }
                onSpiceChange={(level) =>
                  updateSpice(cartItemKey(item.config), level)
                }
                onProteinChange={(proteinId, proteinLabel) => {
                  const newConfig = {
                    ...item.config,
                    proteinChoice: proteinId,
                  };
                  updateConfig(
                    cartItemKey(item.config),
                    newConfig,
                    proteinLabel
                  );
                }}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border px-5 py-5 space-y-4 shrink-0 bg-card">
            {/* Pricing summary */}
            <div className="space-y-1 text-sm">
              {subtotal !== null ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-foreground/70">Subtotal</span>
                    <span className="font-semibold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-base text-primary pt-1">
                    <span>Estimated total</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <div className="rounded-xl bg-muted/60 px-4 py-3 text-xs text-foreground/70 leading-relaxed">
                  <span className="font-semibold text-foreground">
                    Pricing pending.
                  </span>{" "}
                  Final pricing will be confirmed with your catering quote.
                </div>
              )}
            </div>

            <Button
              className="w-full rounded-full bg-primary text-white hover:bg-primary/90 font-bold h-12 text-base shadow-md"
              onClick={handleRequestOrder}
            >
              Request This Order
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── single cart line ─────────────────────────────────────────────────────────

type CartLineItemProps = {
  item: CartItem;
  onRemove: () => void;
  onPeopleChange: (delta: number) => void;
  onSpiceChange: (level: SpiceLevelValue) => void;
  onProteinChange: (proteinId: string, proteinLabel: string) => void;
};

function CartLineItem({
  item,
  onRemove,
  onPeopleChange,
  onSpiceChange,
  onProteinChange,
}: CartLineItemProps) {
  const menuItem = menu.find((m) => m.id === item.config.menuItemId);
  const canCustomiseSpice = menuItem?.spiceCustomizable !== false && (menuItem?.spiceLevel ?? 0) > 0;
  const proteinOptions = menuItem?.proteinOptions ?? [];
  const customizationLabel = menuItem?.customizationLabel ?? "Protein";

  return (
    <div className="rounded-2xl border border-border bg-background p-4 space-y-3">
      {/* Top row: image + title + remove */}
      <div className="flex items-start gap-3">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-14 h-14 rounded-xl object-contain bg-muted shrink-0"
          />
        ) : (
          <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0">
            {menuItem?.icon ?? "🍽️"}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-foreground leading-tight">
            {item.name}
          </p>
          {item.proteinLabel && (
            <p className="text-xs text-foreground/60 mt-0.5">
              {item.proteinLabel}
            </p>
          )}
          {canCustomiseSpice && (
            <div className="mt-1">
              <SpiceLevel level={item.config.spiceLevel} />
            </div>
          )}
        </div>
        <button
          onClick={onRemove}
          className="text-foreground/40 hover:text-destructive transition-colors p-1 shrink-0"
          aria-label={`Remove ${item.name}`}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Protein / style selector (if applicable) */}
      {proteinOptions.length > 0 && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            {customizationLabel}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {proteinOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onProteinChange(opt.id, opt.label)}
                className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                  item.config.proteinChoice === opt.id
                    ? "bg-primary/10 border-primary text-primary font-semibold"
                    : "bg-card border-border text-foreground/70 hover:border-primary/50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Spice selector */}
      {canCustomiseSpice && (
        <div className="space-y-1">
          <p className="text-xs font-semibold text-foreground/60 uppercase tracking-wide">
            Spice level
          </p>
          <SpiceLevelSelector
            value={item.config.spiceLevel}
            onChange={onSpiceChange}
            name={`cart-spice-${cartItemKey(item.config)}`}
          />
        </div>
      )}

      {/* People count + price */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPeopleChange(-1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors disabled:opacity-40"
            aria-label="Decrease people count"
            disabled={item.quantity <= 1}
          >
            <Minus size={13} />
          </button>
          <span className="text-sm font-semibold text-center whitespace-nowrap">
            {item.quantity} {item.quantity === 1 ? "person" : "people"}
          </span>
          <button
            onClick={() => onPeopleChange(1)}
            className="w-7 h-7 rounded-full border border-border flex items-center justify-center text-foreground/70 hover:bg-muted transition-colors"
            aria-label="Increase people count"
          >
            <Plus size={13} />
          </button>
        </div>
        <div className="text-sm font-semibold text-right">
          {typeof item.basePrice === "number" ? (
            <span className="text-primary">
              ${(item.basePrice * item.quantity).toFixed(2)}
            </span>
          ) : (
            <span className="text-foreground/50 text-xs">Pricing pending</span>
          )}
        </div>
      </div>
    </div>
  );
}
