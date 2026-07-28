import { createApp } from "./app";

const port = Number(process.env.API_PORT ?? process.env.PORT ?? 5000);
const app = createApp();

app.listen(port, "0.0.0.0", () => {
  console.info(`Gul Halal Food server listening on port ${port}`);
});
