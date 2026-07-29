import type { CustomerOrderItem } from "../../src/shared/orders.js";
import { formatCents, pricingSummaryLines, resolveLineTotalCents, summarizePricing } from "../../src/shared/pricing.js";

export type NotificationOrder = {
  reference: string;
  eventDate: string;
  eventType: string;
  venue: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  dietaryNeeds?: string;
  items: CustomerOrderItem[];
  quotedTotalCents?: number;
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]!);
const formatDate = (value: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${value}T00:00:00Z`));
const summary = (order: NotificationOrder) => summarizePricing(order.items, order.quotedTotalCents);
const summaryText = (order: NotificationOrder) => pricingSummaryLines(summary(order)).join("\n");
const itemText = (order: NotificationOrder, showPrices: boolean) => order.items.map((item) => {
  const total = showPrices && item.lineTotalCents !== undefined ? ` — ${formatCents(item.lineTotalCents)}` : "";
  return `${item.name} — ${item.peopleCount} people${total}`;
}).join("\n");
const configuration = (item: CustomerOrderItem) => [item.proteinLabel, item.spiceLevel > 0 ? `Spice level ${item.spiceLevel}` : undefined, ...Object.values(item.extras)].filter(Boolean).join(" · ");
const itemHtml = (order: NotificationOrder, includeConfiguration: boolean) => order.items.map((item) => {
  const lineTotal = resolveLineTotalCents(item);
  return `<li style="margin-bottom:12px"><strong>${escapeHtml(item.name)}</strong> — ${item.peopleCount} people${item.unitPriceCents !== undefined ? `<br>${formatCents(item.unitPriceCents)} per person · ${formatCents(lineTotal!)}` : "<br>Pricing pending"}${includeConfiguration && configuration(item) ? `<br><span style="color:#52604f">${escapeHtml(configuration(item))}</span>` : ""}</li>`;
}).join("");
const summaryHtml = (order: NotificationOrder) => pricingSummaryLines(summary(order)).map((line) => `<p style="margin:4px 0"><strong>${escapeHtml(line)}</strong></p>`).join("");

export function customerSmsTemplate(order: NotificationOrder, statusUrl: string) {
  return `Gul Halal Food: We received order request ${order.reference} for ${formatDate(order.eventDate)}.\n\nItems:\n${itemText(order, false)}\n\n${summaryText(order)}\n\nPricing and availability will be confirmed.\n\nTrack your order:\n${statusUrl}\n\nReply STOP to unsubscribe.`;
}

export function customerEmailTemplate(order: NotificationOrder, statusUrl: string) {
  return {
    subject: `Gul Halal Food order request ${order.reference}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:640px;margin:auto;color:#253821"><h1 style="color:#174f2a">Gul Halal Food</h1><h2>Order request ${escapeHtml(order.reference)}</h2><p>We received your catering request. Availability and final pricing require confirmation.</p><p><strong>Event:</strong> ${formatDate(order.eventDate)} · ${escapeHtml(order.eventType)}<br><strong>Venue / city:</strong> ${escapeHtml(order.venue)}</p><h3>Selected dishes</h3><ul>${itemHtml(order, false)}</ul>${summaryHtml(order)}<p style="margin-top:24px"><a href="${escapeHtml(statusUrl)}" style="display:inline-block;background:#174f2a;color:white;padding:14px 22px;border-radius:10px;text-decoration:none;font-weight:bold">View Order Status</a></p></div>`,
  };
}

export function adminSmsTemplate(order: NotificationOrder, adminUrl: string) {
  return `New Gul Halal Food order\n\n${order.reference}\nCustomer: ${order.customerName}\nPhone: ${order.customerPhone}\nEvent: ${formatDate(order.eventDate)}\nLocation: ${order.venue}\n\nItems:\n${itemText(order, true)}\n\n${summaryText(order)}\n\nOpen order:\n${adminUrl}`;
}

export function adminEmailTemplate(order: NotificationOrder, adminUrl: string) {
  return {
    subject: `New Gul Halal Food order ${order.reference}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto;color:#253821"><h1 style="color:#174f2a">New Gul Halal Food order</h1><h2>${escapeHtml(order.reference)}</h2><p><strong>Customer:</strong> ${escapeHtml(order.customerName)}<br><strong>Phone:</strong> ${escapeHtml(order.customerPhone)}<br><strong>Email:</strong> ${escapeHtml(order.customerEmail)}<br><strong>Event:</strong> ${formatDate(order.eventDate)} · ${escapeHtml(order.eventType)}<br><strong>Location:</strong> ${escapeHtml(order.venue)}</p>${order.dietaryNeeds ? `<p><strong>Dietary requirements:</strong> ${escapeHtml(order.dietaryNeeds)}</p>` : ""}<h3>Selected dishes</h3><ul>${itemHtml(order, true)}</ul>${summaryHtml(order)}<p style="margin-top:24px"><a href="${escapeHtml(adminUrl)}" style="display:inline-block;background:#174f2a;color:white;padding:16px 24px;border-radius:10px;text-decoration:none;font-weight:bold">Open Order</a></p></div>`,
  };
}
