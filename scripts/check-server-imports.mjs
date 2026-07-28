import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const roots = ["api", "server"];
const sourceExtensions = new Set([".ts", ".tsx", ".mts", ".cts", ".js", ".mjs", ".cjs"]);
const relativeSpecifierPatterns = [
  /\bfrom\s*["'](\.{1,2}\/[^"']+)["']/g,
  /\bimport\s*["'](\.{1,2}\/[^"']+)["']/g,
  /\bimport\s*\(\s*["'](\.{1,2}\/[^"']+)["']\s*\)/g,
];

async function sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(target);
    return sourceExtensions.has(path.extname(entry.name)) ? [target] : [];
  }));
  return nested.flat();
}

const violations = [];
for (const root of roots) {
  for (const file of await sourceFiles(root)) {
    const content = await readFile(file, "utf8");
    for (const pattern of relativeSpecifierPatterns) {
      for (const match of content.matchAll(pattern)) {
        if (!match[1].endsWith(".js")) violations.push(`${file}: ${match[1]}`);
      }
    }
  }
}

if (violations.length) {
  console.error("Extensionless relative server imports found:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exitCode = 1;
} else {
  console.log("All relative imports under api/ and server/ use Node ESM .js specifiers.");
}
