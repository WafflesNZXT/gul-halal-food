import type { CustomerOrder } from "../../src/shared/orders.js";

export async function sendOrderConfirmation(_order: CustomerOrder) {
  return { status: "not_configured" as const };
}

export async function sendNewOrderNotification(_order: CustomerOrder) {
  return { status: "not_configured" as const };
}
