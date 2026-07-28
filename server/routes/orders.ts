import { Router } from "express";
import { PostgresOrderRepository, type OrderRepository } from "../repositories/orders";
import { createOrder, getPublicOrderStatus } from "../services/orders";
import { parseCreateOrder } from "../validation/orders";
import { orderRateLimit, requireTrustedOrigin } from "../middleware/security";
import { getPublicBaseUrl } from "../env";

export function createOrdersRouter(repository: OrderRepository = new PostgresOrderRepository()) {
  const router = Router();

  router.post("/orders", orderRateLimit, requireTrustedOrigin, async (req: any, res: any, next: any) => {
    try {
      const order = await createOrder(repository, parseCreateOrder(req.body), { publicBaseUrl: getPublicBaseUrl(req) });
      return res.status(201).json(order);
    } catch (error) {
      return next(error);
    }
  });

  router.get("/orders/status/:token", async (req: any, res: any, next: any) => {
    try {
      return res.json(await getPublicOrderStatus(repository, req.params.token));
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
