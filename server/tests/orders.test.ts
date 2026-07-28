import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "../app";
import { AppError } from "../errors";
import type { OrderRepository, StoredOrderInput } from "../repositories/orders";
import { createOrder, getPublicOrderStatus, hashStatusToken } from "../services/orders";
import { parseCreateOrder } from "../validation/orders";
import type { CreateOrderRequest, CustomerOrder } from "../../src/shared/orders";

const validPayload: CreateOrderRequest = {
  customerName: "Amina Khan",
  customerEmail: "amina@example.com",
  customerPhone: "+1 555 555 5555",
  eventDate: "2026-08-20",
  eventType: "family",
  venue: "Community center",
  items: [{ menuItemId: "biryani", proteinChoice: "chicken", spiceLevel: 2, peopleCount: 25 }],
  website: "",
};

class MemoryOrders implements OrderRepository {
  readonly records = new Map<string, { input: StoredOrderInput; publicOrder: CustomerOrder }>();
  failCreates = false;

  async referenceExists(reference: string) {
    return [...this.records.values()].some((record) => record.input.reference === reference);
  }

  async create(input: StoredOrderInput) {
    if (this.failCreates) throw new Error("database connection failed");
    const publicOrder: CustomerOrder = {
      reference: input.reference,
      status: input.status,
      eventDate: input.eventDate,
      eventType: input.eventType,
      venue: input.venue,
      createdAt: input.createdAt.toISOString(),
      updatedAt: input.createdAt.toISOString(),
      items: input.items,
      statusHistory: [{ previousStatus: null, newStatus: "received", changedAt: input.createdAt.toISOString() }],
    };
    this.records.set(input.statusTokenHash, { input, publicOrder });
    return publicOrder;
  }

  async findPublicByTokenHash(tokenHash: string) {
    return this.records.get(tokenHash)?.publicOrder ?? null;
  }
}

test("valid order payload is accepted with a human reference and secure status link", async () => {
  const repository = new MemoryOrders();
  const result = await createOrder(repository, parseCreateOrder(validPayload));
  assert.match(result.reference, /^GHF-\d{4}-[A-F0-9]{6}$/);
  assert.match(result.statusUrl, /^\/order-status\/[A-Za-z0-9_-]{43}$/);
  assert.equal(result.status, "received");
  assert.equal(repository.records.size, 1);
});

test("empty carts and invalid people counts are rejected", () => {
  assert.throws(() => parseCreateOrder({ ...validPayload, items: [] }), (error: unknown) => error instanceof AppError && error.statusCode === 400);
  assert.throws(() => parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], peopleCount: 0 }] }), (error: unknown) => error instanceof AppError && error.statusCode === 400);
});

test("unknown dishes and invalid dish configurations are rejected", async () => {
  const repository = new MemoryOrders();
  await assert.rejects(() => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], menuItemId: "not-a-dish" }] })), (error: unknown) => error instanceof AppError && error.statusCode === 400);
  await assert.rejects(() => createOrder(repository, parseCreateOrder({ ...validPayload, items: [{ ...validPayload.items[0], proteinChoice: "pork" }] })), (error: unknown) => error instanceof AppError && error.statusCode === 400);
});

test("secure status lookup succeeds and excludes private customer fields", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const token = created.statusUrl.split("/").pop()!;
  const order = await getPublicOrderStatus(repository, token);
  assert.equal(order.reference, created.reference);
  assert.equal("customerEmail" in order, false);
  assert.equal("customerPhone" in order, false);
  assert.equal("statusTokenHash" in order, false);
});

test("invalid status tokens get the same safe not-found response", async () => {
  const repository = new MemoryOrders();
  await assert.rejects(() => getPublicOrderStatus(repository, "invalid"), (error: unknown) => error instanceof AppError && error.statusCode === 404 && error.message === "Order not found.");
  await assert.rejects(() => getPublicOrderStatus(repository, "a".repeat(43)), (error: unknown) => error instanceof AppError && error.statusCode === 404 && error.message === "Order not found.");
});

test("database failures receive a safe API response", async () => {
  const repository = new MemoryOrders();
  repository.failCreates = true;
  const app = createApp(repository);
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/orders`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(validPayload) });
    const body = await response.json() as { error: { code: string; message: string } };
    assert.equal(response.status, 500);
    assert.equal(body.error.code, "SERVER_ERROR");
    assert.doesNotMatch(body.error.message, /database/i);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("health endpoint returns only a safe service status", async () => {
  const app = createApp(new MemoryOrders());
  const server = await new Promise<any>((resolve) => {
    const instance = app.listen(0, "127.0.0.1", () => resolve(instance));
  });
  try {
    const port = (server.address() as AddressInfo).port;
    const response = await fetch(`http://127.0.0.1:${port}/api/health`);
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test("status tokens are stored only as hashes", async () => {
  const repository = new MemoryOrders();
  const created = await createOrder(repository, parseCreateOrder(validPayload));
  const token = created.statusUrl.split("/").pop()!;
  assert.equal(repository.records.has(token), false);
  assert.equal(repository.records.has(hashStatusToken(token)), true);
});
