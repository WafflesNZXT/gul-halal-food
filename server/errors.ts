export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string,
    public readonly details?: Array<{ path: string; message: string }>,
  ) {
    super(message);
  }
}

export const serviceUnavailable = () => new AppError(503, "SERVICE_UNAVAILABLE", "Order requests are temporarily unavailable. Please try again later.");
export const notFound = () => new AppError(404, "NOT_FOUND", "Order not found.");
