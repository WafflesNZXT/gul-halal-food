export type SpiceLevelValue = 1 | 2 | 3;

/** Uniquely identifies a configured cart line */
export type CartItemConfig = {
  menuItemId: string;
  proteinChoice?: string; // id from MenuItem.proteinOptions
  spiceLevel: SpiceLevelValue;
};

/** A single cart line */
export type CartItem = {
  config: CartItemConfig;
  quantity: number;
  // Denormalised snapshot from menu at time of add
  name: string;
  image?: string;
  pricingLabel?: string;
  basePrice?: number; // undefined → pricing pending
  proteinLabel?: string; // human-readable protein name
};
