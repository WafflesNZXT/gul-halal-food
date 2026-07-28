import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import type { CartItem, CartItemConfig, SpiceLevelValue } from "@/types/cart";

// ─── helpers ─────────────────────────────────────────────────────────────────

export function cartItemKey(cfg: CartItemConfig): string {
  return [cfg.menuItemId, cfg.proteinChoice ?? "", cfg.spiceLevel].join("|");
}

// ─── state / reducer ─────────────────────────────────────────────────────────

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; key: string }
  | { type: "UPDATE_QTY"; key: string; delta: number }
  | {
      type: "UPDATE_CONFIG";
      oldKey: string;
      newConfig: CartItemConfig;
      newProteinLabel?: string;
    }
  | { type: "UPDATE_SPICE"; key: string; spiceLevel: SpiceLevelValue }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_CART" };

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const key = cartItemKey(action.item.config);
      const idx = state.items.findIndex((i) => cartItemKey(i.config) === key);
      if (idx >= 0) {
        const items = [...state.items];
        items[idx] = {
          ...items[idx],
          quantity: items[idx].quantity + action.item.quantity,
        };
        return { ...state, items };
      }
      return { ...state, items: [...state.items, action.item] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => cartItemKey(i.config) !== action.key),
      };

    case "UPDATE_QTY": {
      const items = state.items
        .map((i) =>
          cartItemKey(i.config) === action.key
            ? { ...i, quantity: Math.max(0, i.quantity + action.delta) }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { ...state, items };
    }

    case "UPDATE_CONFIG": {
      const oldItem = state.items.find(
        (i) => cartItemKey(i.config) === action.oldKey
      );
      if (!oldItem) return state;
      const newKey = cartItemKey(action.newConfig);
      const existing = state.items.find(
        (i) => cartItemKey(i.config) === newKey
      );
      if (existing) {
        return {
          ...state,
          items: state.items
            .map((i) =>
              cartItemKey(i.config) === newKey
                ? { ...i, quantity: i.quantity + oldItem.quantity }
                : i
            )
            .filter((i) => cartItemKey(i.config) !== action.oldKey),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          cartItemKey(i.config) === action.oldKey
            ? {
                ...i,
                config: action.newConfig,
                proteinLabel: action.newProteinLabel,
              }
            : i
        ),
      };
    }

    case "UPDATE_SPICE": {
      const item = state.items.find(
        (i) => cartItemKey(i.config) === action.key
      );
      if (!item) return state;
      const newConfig = { ...item.config, spiceLevel: action.spiceLevel };
      return reducer(state, {
        type: "UPDATE_CONFIG",
        oldKey: action.key,
        newConfig,
      });
    }

    case "OPEN_CART":
      return { ...state, isOpen: true };
    case "CLOSE_CART":
      return { ...state, isOpen: false };
    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    default:
      return state;
  }
}

// ─── localStorage persistence ────────────────────────────────────────────────

const STORAGE_KEY = "gul-cart-v1";

function loadCart(): CartState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { items: [], isOpen: false };
    const parsed = JSON.parse(raw) as Partial<CartState>;
    if (!Array.isArray(parsed.items)) return { items: [], isOpen: false };
    const items = parsed.items.filter(
      (i): i is CartItem =>
        i != null &&
        typeof i === "object" &&
        typeof i.name === "string" &&
        typeof i.quantity === "number" &&
        i.config != null &&
        typeof i.config.menuItemId === "string" &&
        typeof i.config.spiceLevel === "number"
    );
    return { items, isOpen: false };
  } catch {
    return { items: [], isOpen: false };
  }
}

function saveCart(state: CartState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: state.items }));
  } catch {
    // storage unavailable – silent fallback
  }
}

// ─── context ─────────────────────────────────────────────────────────────────

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQty: (key: string, delta: number) => void;
  updateConfig: (
    oldKey: string,
    newConfig: CartItemConfig,
    newProteinLabel?: string
  ) => void;
  updateSpice: (key: string, spiceLevel: SpiceLevelValue) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadCart);

  useEffect(() => {
    saveCart(state);
  }, [state]);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", item }),
    []
  );
  const removeItem = useCallback(
    (key: string) => dispatch({ type: "REMOVE_ITEM", key }),
    []
  );
  const updateQty = useCallback(
    (key: string, delta: number) => dispatch({ type: "UPDATE_QTY", key, delta }),
    []
  );
  const updateConfig = useCallback(
    (oldKey: string, newConfig: CartItemConfig, newProteinLabel?: string) =>
      dispatch({ type: "UPDATE_CONFIG", oldKey, newConfig, newProteinLabel }),
    []
  );
  const updateSpice = useCallback(
    (key: string, spiceLevel: SpiceLevelValue) =>
      dispatch({ type: "UPDATE_SPICE", key, spiceLevel }),
    []
  );
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const toggleCart = useCallback(() => dispatch({ type: "TOGGLE_CART" }), []);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        itemCount: state.items.reduce((s, i) => s + i.quantity, 0),
        isOpen: state.isOpen,
        addItem,
        removeItem,
        updateQty,
        updateConfig,
        updateSpice,
        openCart,
        closeCart,
        toggleCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
