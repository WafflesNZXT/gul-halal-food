import { menu } from "../data/menu.js";
import type { CustomerOrderItem, OrderItemInput } from "./orders.js";

export type MenuValidationIssue = { path: string; message: string };

function defaultSpiceLevel(spiceLevel: number): 1 | 2 | 3 {
  return (spiceLevel >= 1 && spiceLevel <= 3 ? spiceLevel : 1) as 1 | 2 | 3;
}

/**
 * Validates a cart line against the same menu configuration used by the UI.
 * The client never supplies display names, prices, or arbitrary option labels.
 */
export function validateMenuOrderItems(items: OrderItemInput[]): {
  items: CustomerOrderItem[];
  issues: MenuValidationIssue[];
} {
  const issues: MenuValidationIssue[] = [];
  const normalized: CustomerOrderItem[] = [];

  for (const [index, item] of items.entries()) {
    const path = `items.${index}`;
    const dish = menu.find((candidate) => candidate.id === item.menuItemId);
    if (!dish || !dish.available) {
      issues.push({ path: `${path}.menuItemId`, message: "This dish is not available." });
      continue;
    }

    const protein = dish.proteinOptions?.find((option) => option.id === item.proteinChoice);
    if (dish.proteinOptions?.length) {
      if (!protein) {
        issues.push({ path: `${path}.proteinChoice`, message: "Choose a valid dish option." });
      }
    } else if (item.proteinChoice) {
      issues.push({ path: `${path}.proteinChoice`, message: "This dish does not accept that option." });
    }

    const extras = item.extras ?? {};
    const groups = new Map((dish.extraOptions ?? []).map((group) => [group.id, group]));
    for (const [key, value] of Object.entries(extras)) {
      const group = groups.get(key);
      if (!group) {
        issues.push({ path: `${path}.extras.${key}`, message: "This option is not supported." });
        continue;
      }
      const visible = !group.showWhen || extras[group.showWhen.field] === group.showWhen.value;
      if (!visible) {
        issues.push({ path: `${path}.extras.${key}`, message: "This option is not currently available." });
        continue;
      }
      if (group.type === "boolean") {
        if (value !== "yes" && value !== "no") {
          issues.push({ path: `${path}.extras.${key}`, message: "Choose yes or no." });
        }
      } else if (!group.options?.some((option) => option.id === value)) {
        issues.push({ path: `${path}.extras.${key}`, message: "Choose a valid option." });
      }
    }

    for (const group of dish.extraOptions ?? []) {
      const visible = !group.showWhen || extras[group.showWhen.field] === group.showWhen.value;
      if (visible && group.required !== false && !extras[group.id]) {
        issues.push({ path: `${path}.extras.${group.id}`, message: "Choose a required option." });
      }
    }

    const expectedSpice = defaultSpiceLevel(dish.spiceLevel);
    if (dish.spiceCustomizable === false && item.spiceLevel !== expectedSpice) {
      issues.push({ path: `${path}.spiceLevel`, message: "This dish does not support a custom spice level." });
    }

    if (!issues.some((issue) => issue.path.startsWith(path))) {
      normalized.push({
        menuItemId: dish.id,
        slug: dish.slug,
        name: dish.name,
        peopleCount: item.peopleCount,
        proteinLabel: protein?.label,
        spiceLevel: item.spiceLevel,
        extras,
        pricingLabel: dish.pricingLabel ?? dish.price,
      });
    }
  }

  return { items: normalized, issues };
}
