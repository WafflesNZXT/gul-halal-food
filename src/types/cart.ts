import type { SpiceLevel } from "@/shared/orders";

export type SpiceLevelValue = SpiceLevel;

/** Uniquely identifies a configured cart line */
export type CartItemConfig = {
  menuItemId: string;
  proteinChoice?: string; // id from MenuItem.proteinOptions
  spiceLevel: SpiceLevelValue;
  extras?: Record<string, string>; // extra option selections keyed by ExtraOptionGroup.id
};

/** A single cart line */
export type CartItem = {
  config: CartItemConfig;
  quantity: number;
  // Denormalised snapshot from menu at time of add
  name: string;
  image?: string;
  pricingLabel?: string;
  unitPriceCents?: number; // undefined → pricing pending
  proteinLabel?: string; // human-readable protein name
};
