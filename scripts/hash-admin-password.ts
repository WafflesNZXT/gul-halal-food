import { stdin, stdout } from "node:process";
import { hashAdminPassword } from "../server/services/admin-auth.js";

async function readHidden(prompt: string) {
  if (!stdin.isTTY) throw new Error("Run this command in an interactive terminal.");
  stdout.write(prompt);
  stdin.setRawMode(true);
  stdin.resume();
  return await new Promise<string>((resolve, reject) => {
    let value = "";
    const onData = (chunk: Buffer) => {
      const character = chunk.toString("utf8");
      if (character === "\r" || character === "\n") { cleanup(); stdout.write("\n"); resolve(value); return; }
      if (character === "\u0003") { cleanup(); reject(new Error("Cancelled.")); return; }
      if (character === "\b" || character === "\u007f") { value = value.slice(0, -1); return; }
      value += character;
    };
    const cleanup = () => { stdin.off("data", onData); stdin.setRawMode(false); stdin.pause(); };
    stdin.on("data", onData);
  });
}

try {
  const password = await readHidden("New admin password: ");
  const confirmation = await readHidden("Confirm admin password: ");
  if (password !== confirmation) throw new Error("Passwords did not match.");
  stdout.write(`${await hashAdminPassword(password)}\n`);
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not create password hash.");
  process.exitCode = 1;
}
