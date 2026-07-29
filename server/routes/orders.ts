import { Router } from "express";
import { PostgresOrderRepository, type OrderRepository } from "../repositories/orders.js";
import { createOrder, getPublicOrderStatus, lookupOrder } from "../services/orders.js";
import { parseCreateOrder } from "../validation/orders.js";
import { parseOrderLookup } from "../validation/lookup.js";
import { orderLookupRateLimit, orderRateLimit, requireJsonContent, requireTrustedOrigin } from "../middleware/security.js";
import { getPublicBaseUrl } from "../env.js";
import { PostgresNotificationDeliveryRepository, type NotificationDeliveryRepository } from "../repositories/notifications.js";

export function createOrdersRouter(repository?: OrderRepository, notificationRepository?: NotificationDeliveryRepository, environment: NodeJS.ProcessEnv = process.env) {
  const orderRepository = repository ?? new PostgresOrderRepository();
  const deliveries = notificationRepository ?? (repository ? undefined : new PostgresNotificationDeliveryRepository());
  const router = Router();

  router.post("/orders", orderRateLimit, requireTrustedOrigin, async (req: any, res: any, next: any) => {
    try {
      const order = await createOrder(orderRepository, parseCreateOrder(req.body), { publicBaseUrl: getPublicBaseUrl(req, environment), notificationRepository: deliveries, environment });
      return res.status(201).json(order);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/orders/status/:token", async (req: any, res: any, next: any) => {
    try {
      return res.json(await getPublicOrderStatus(orderRepository, req.params.token));
    } catch (error) {
      return next(error);
    }
  });

  router.post("/orders/lookup", orderLookupRateLimit, requireTrustedOrigin, requireJsonContent, async (req: any, res: any, next: any) => {
    try {
      return res.json(await lookupOrder(orderRepository, parseOrderLookup(req.body)));
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
