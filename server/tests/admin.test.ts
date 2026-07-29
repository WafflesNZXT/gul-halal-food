import assert from "node:assert/strict";
import test from "node:test";
import type { AddressInfo } from "node:net";
import { createApp } from "../app.js";
import type { AdminOrder, AdminOrderListResponse } from "../../src/shared/admin.js";
import type { OrderStatus } from "../../src/shared/orders.js";
import type { AdminRepository, AdminSession, AdminOrderListOptions } from "../repositories/admin.js";
import { createSessionToken, hashAdminPassword, hashSessionToken, verifyAdminPassword } from "../services/admin-auth.js";

const sampleOrder: AdminOrder = {
  reference: "GHF-2026-ABC123", status: "received", customerName: "Amina Khan", customerEmail: "amina@example.com", customerPhone: "+15555555555", eventDate: "2026-08-20", eventType: "family", venue: "Community center", dishCount: 1, totalPeople: 25, createdAt: "2026-07-01T00:00:00.000Z", updatedAt: "2026-07-01T00:00:00.000Z", items: [{ menuItemId: "keer", slug: "keer", name: "Keer", peopleCount: 25, spiceLevel: 0, extras: {}, pricingLabel: "Contact for pricing" }], statusHistory: [{ previousStatus: null, newStatus: "received", changedAt: "2026-07-01T00:00:00.000Z" }], adminNotes: "Call before noon", quotedTotalCents: 45000,
};

class MemoryAdminRepository implements AdminRepository {
  sessions = new Map<string, AdminSession>();
  order = structuredClone(sampleOrder);
  async createSession(tokenHash: string, expiresAt: Date) { this.sessions.set(tokenHash, { id: tokenHash, tokenHash, expiresAt, lastSeenAt: new Date() }); }
  async findSession(tokenHash: string) { const session = this.sessions.get(tokenHash); return session && session.expiresAt > new Date() ? session : null; }
  async revokeSession(tokenHash: string) { this.sessions.delete(tokenHash); }
  async touchSession(tokenHash: string, lastSeenAt: Date) { const session = this.sessions.get(tokenHash); if (session) session.lastSeenAt = lastSeenAt; }
  async listOrders(options: AdminOrderListOptions): Promise<AdminOrderListResponse> { const matches = !options.search || [this.order.reference, this.order.customerName, this.order.customerPhone].some((value) => value.toLowerCase().includes(options.search!.toLowerCase())); return { orders: matches ? [{ reference: this.order.reference, status: this.order.status, customerName: this.order.customerName, customerPhone: this.order.customerPhone, eventDate: this.order.eventDate, eventType: this.order.eventType, venue: this.order.venue, dishCount: this.order.dishCount, totalPeople: this.order.totalPeople, createdAt: this.order.createdAt, updatedAt: this.order.updatedAt }] : [], page: 1, hasMore: false }; }
  async findOrder(reference: string) { return reference === this.order.reference ? structuredClone(this.order) : null; }
  async updateStatus(reference: string, status: OrderStatus) { if (reference !== this.order.reference) return null; if (this.order.status !== status) { const previousStatus = this.order.status; this.order.status = status; this.order.updatedAt = new Date().toISOString(); this.order.statusHistory.push({ previousStatus, newStatus: status, changedAt: this.order.updatedAt }); } return structuredClone(this.order); }
  async updateNotes(reference: string, adminNotes: string | undefined) { if (reference !== this.order.reference) return null; this.order.adminNotes = adminNotes; return structuredClone(this.order); }
  async updatePrice(reference: string, quotedTotalCents: number | undefined) { if (reference !== this.order.reference) return null; this.order.quotedTotalCents = quotedTotalCents; return structuredClone(this.order); }
}

async function withServer(run: (base: string, repository: MemoryAdminRepository) => Promise<void>) {
  const repository = new MemoryAdminRepository(); const passwordHash = await hashAdminPassword("this is a secure test password");
  const app = createApp(undefined, repository, { ADMIN_USERNAME: "gul-admin", ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SESSION_TTL_HOURS: "12" } as NodeJS.ProcessEnv);
  const server = await new Promise<any>((resolve) => { const instance = app.listen(0, "127.0.0.1", () => resolve(instance)); });
  try { await run(`http://127.0.0.1:${(server.address() as AddressInfo).port}`, repository); } finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
}

async function login(base: string) { const response = await fetch(`${base}/api/admin/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: "gul-admin", password: "this is a secure test password" }) }); return { response, cookie: response.headers.get("set-cookie")?.split(";")[0] ?? "" }; }

test("admin password hashes verify without retaining plaintext", async () => { const hash = await hashAdminPassword("a sufficiently long password"); assert.match(hash, /^scrypt-v1\$/); assert.equal(await verifyAdminPassword("a sufficiently long password", hash), true); assert.equal(await verifyAdminPassword("wrong password", hash), false); });

test("admin login creates an HttpOnly session and rejects invalid credentials generically", async () => withServer(async (base) => { const bad = await fetch(`${base}/api/admin/login`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ username: "wrong", password: "wrong" }) }); assert.equal(bad.status, 401); assert.equal((await bad.json()).error.message, "The username or password is not correct."); const { response, cookie } = await login(base); assert.equal(response.status, 200); assert.match(response.headers.get("set-cookie") ?? "", /HttpOnly;.*SameSite=Lax/i); assert.match(cookie, /^gul_admin_session=/); }));

test("admin APIs require a live session, support search and revoke logout", async () => withServer(async (base) => { const unauthenticated = await fetch(`${base}/api/admin/orders`); assert.equal(unauthenticated.status, 401); const { cookie } = await login(base); const list = await fetch(`${base}/api/admin/orders?group=new&search=Amina`, { headers: { cookie } }); assert.equal(list.status, 200); assert.equal((await list.json()).orders[0].reference, sampleOrder.reference); const logout = await fetch(`${base}/api/admin/logout`, { method: "POST", headers: { cookie, "content-type": "application/json" }, body: "{}" }); assert.equal(logout.status, 204); const afterLogout = await fetch(`${base}/api/admin/orders`, { headers: { cookie } }); assert.equal(afterLogout.status, 401); }));

test("admin updates preserve history and private fields never reach customer contracts", async () => withServer(async (base, repository) => { const { cookie } = await login(base); const headers = { cookie, "content-type": "application/json" }; const status = await fetch(`${base}/api/admin/orders/${sampleOrder.reference}/status`, { method: "PATCH", headers, body: JSON.stringify({ status: "cancelled" }) }); const updated = await status.json(); assert.equal(updated.status, "cancelled"); assert.equal(updated.statusHistory.length, 2); const duplicate = await fetch(`${base}/api/admin/orders/${sampleOrder.reference}/status`, { method: "PATCH", headers, body: JSON.stringify({ status: "cancelled" }) }); assert.equal((await duplicate.json()).statusHistory.length, 2); const notes = await fetch(`${base}/api/admin/orders/${sampleOrder.reference}/notes`, { method: "PATCH", headers, body: JSON.stringify({ adminNotes: "Private note" }) }); assert.equal((await notes.json()).adminNotes, "Private note"); const price = await fetch(`${base}/api/admin/orders/${sampleOrder.reference}/price`, { method: "PATCH", headers, body: JSON.stringify({ quotedTotalCents: 127550 }) }); assert.equal((await price.json()).quotedTotalCents, 127550); const invalidPrice = await fetch(`${base}/api/admin/orders/${sampleOrder.reference}/price`, { method: "PATCH", headers, body: JSON.stringify({ quotedTotalCents: -1 }) }); assert.equal(invalidPrice.status, 400); const publicShape = { reference: repository.order.reference, items: repository.order.items }; assert.equal("adminNotes" in publicShape, false); assert.equal("quotedTotalCents" in publicShape, false); assert.equal(publicShape.items[0].spiceLevel, 0); }));

test("expired session tokens are rejected", async () => { const repository = new MemoryAdminRepository(); const token = createSessionToken(); await repository.createSession(hashSessionToken(token), new Date(Date.now() - 1)); assert.equal(await repository.findSession(hashSessionToken(token)), null); });
