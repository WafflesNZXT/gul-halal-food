import { createApp } from "../../../server/app.js";

// Explicit Vercel filesystem route for secure customer status links. Business
// logic remains in the shared Express router at /api/orders/status/:token.
export default createApp();
