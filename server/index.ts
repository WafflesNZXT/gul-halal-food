import "./env.js";
import { createApp } from "./app.js";
import { getApiPort } from "./env.js";

const port = getApiPort();
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.info(`Gul Halal Food server listening on port ${port}`);
});
