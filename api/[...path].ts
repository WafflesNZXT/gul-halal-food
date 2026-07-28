import { createApp } from "../server/app";

// Vercel invokes this API catch-all as a Node.js Serverless Function. The
// standalone listener remains in server/index.ts for local development.
export default createApp();
