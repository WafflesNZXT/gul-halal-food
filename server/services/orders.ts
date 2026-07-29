import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import type { CreateOrderRequest, CreateOrderResponse, CustomerOrder } from "../../src/shared/orders.js";
import { validateMenuOrderItems } from "../../src/shared/menu-validation.js";
import { AppError, notFound } from "../errors.js";
import type { OrderRepository } from "../repositories/orders.js";
import type { LookupRequest } from "../validation/lookup.js";
import type { NotificationProvider } from "./notifications.js";
import type { NotificationDeliveryRepository } from "../repositories/notifications.js";
import { dispatchNewOrderNotifications } from "./notification-dispatch.js";

export function hashStatusToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function newReference() {
  return `GHF-${new Date().getUTCFullYear()}-${randomBytes(4).toString("hex").toUpperCase().slice(0, 6)}`;
}

async function uniqueReference(repository: OrderRepository) {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const reference = newReference();
    if (!(await repository.referenceExists(reference))) return reference;
  }
  throw new AppError(503, "SERVICE_UNAVAILABLE", "Order requests are temporarily unavailable. Please try again later.");
}

export type CreateOrderOptions = {
  publicBaseUrl?: string;
  notificationProvider?: NotificationProvider;
  notificationRepository?: NotificationDeliveryRepository;
  environment?: NodeJS.ProcessEnv;
};

export async function createOrder(
  repository: OrderRepository,
  request: CreateOrderRequest,
  options: CreateOrderOptions = {},
): Promise<CreateOrderResponse> {
  const validatedItems = validateMenuOrderItems(request.items);
  if (validatedItems.issues.length) {
    throw new AppError(400, "VALIDATION_ERROR", "Please correct the selected dishes.", validatedItems.issues);
  }

  const reference = await uniqueReference(repository);
  const orderId = randomUUID();
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const order = await repository.create({
    id: orderId,
    reference,
    status: "received",
    statusTokenHash: hashStatusToken(token),
    customerName: request.customerName,
    customerEmail: request.customerEmail,
    customerPhone: request.customerPhone,
    eventDate: request.eventDate,
    eventType: request.eventType,
    venue: request.venue,
    customerNotes: request.customerNotes,
    dietaryNeeds: request.dietaryNeeds,
    smsConsent: request.smsConsent ?? false,
    smsConsentAt: request.smsConsent ? now : undefined,
    items: validatedItems.items,
    createdAt: now,
  });
  const statusPath = `/order-status/${token}`;
  const statusUrl = options.publicBaseUrl ? new URL(statusPath, options.publicBaseUrl).toString() : statusPath;
  if (options.notificationRepository) {
    const adminUrl = options.publicBaseUrl ? new URL(`/admin/orders/${encodeURIComponent(reference)}`, options.publicBaseUrl).toString() : `/admin/orders/${encodeURIComponent(reference)}`;
    try {
      await dispatchNewOrderNotifications({
        orderId,
        order: {
          reference, eventDate: request.eventDate, eventType: request.eventType, venue: request.venue,
          customerName: request.customerName, customerEmail: request.customerEmail, customerPhone: request.customerPhone,
          dietaryNeeds: request.dietaryNeeds, items: order.items,
        },
        statusUrl, adminUrl, smsConsent: request.smsConsent ?? false,
        repository: options.notificationRepository,
        provider: options.notificationProvider,
        environment: options.environment,
      });
    } catch { /* post-commit notification persistence must not invalidate the order */ }
  }
  return { ...order, statusUrl };
}

export async function getPublicOrderStatus(repository: OrderRepository, token: string): Promise<CustomerOrder> {
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(token)) throw notFound();
  const order = await repository.findPublicByTokenHash(hashStatusToken(token));
  if (!order) throw notFound();
  return order;
}

function normalizedPhone(value: string) { return value.replace(/\D/g, ""); }
function normalizedContact(value: string) {
  const candidate = value.trim();
  if (candidate.includes("@")) return { type: "email" as const, value: candidate.toLowerCase() };
  const digits = normalizedPhone(candidate);
  return digits.length >= 7 && digits.length <= 15 ? { type: "phone" as const, value: digits } : null;
}
function contactMatches(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}
const lookupNotFound = () => new AppError(404, "NOT_FOUND", "We could not find an order matching those details.");

export async function lookupOrder(repository: OrderRepository, request: LookupRequest): Promise<CustomerOrder> {
  const suppliedContact = normalizedContact(request.contact);
  if (!suppliedContact) throw lookupNotFound();
  const match = await repository.findByReferenceForLookup(request.reference);
  if (!match) throw lookupNotFound();
  const emailMatches = suppliedContact.type === "email" && contactMatches(suppliedContact.value, match.customerEmail.trim().toLowerCase());
  const storedPhone = normalizedPhone(match.customerPhone);
  const phoneMatches = suppliedContact.type === "phone" && storedPhone.length >= 7 && contactMatches(suppliedContact.value, storedPhone);
  if (!emailMatches && !phoneMatches) throw lookupNotFound();
  const order = await repository.findCustomerSafeById(match.id);
  if (!order) throw lookupNotFound();
  return order;
}
