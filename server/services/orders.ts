import { createHash, randomBytes, randomUUID } from "node:crypto";
import type { CreateOrderRequest, CreateOrderResponse, CustomerOrder } from "../../src/shared/orders.js";
import { validateMenuOrderItems } from "../../src/shared/menu-validation.js";
import { AppError, notFound } from "../errors.js";
import type { OrderRepository } from "../repositories/orders.js";

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
  const token = randomBytes(32).toString("base64url");
  const now = new Date();
  const order = await repository.create({
    id: randomUUID(),
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
    items: validatedItems.items,
    createdAt: now,
  });
  const statusPath = `/order-status/${token}`;
  return { ...order, statusUrl: options.publicBaseUrl ? new URL(statusPath, options.publicBaseUrl).toString() : statusPath };
}

export async function getPublicOrderStatus(repository: OrderRepository, token: string): Promise<CustomerOrder> {
  if (!/^[A-Za-z0-9_-]{43,128}$/.test(token)) throw notFound();
  const order = await repository.findPublicByTokenHash(hashStatusToken(token));
  if (!order) throw notFound();
  return order;
}
