import "./env";
import { createApp } from "./app";
import { getApiPort } from "./env";

const port = getApiPort();
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.info(`Gul Halal Food server listening on port ${port}`);
});
