import { AppError } from "../errors.js";

export function notFoundApi(_req: any, res: any) {
  return res.status(404).json({ error: { code: "NOT_FOUND", message: "Not found." } });
}

export function errorHandler(error: unknown, _req: any, res: any, _next: any) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({ error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) } });
  }
  return res.status(500).json({ error: { code: "SERVER_ERROR", message: "We could not process this request. Please try again later." } });
}
