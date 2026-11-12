import { readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";
const password = readFileSync(".env.editorial-preview.local", "utf8").match(
  /^EDITORIAL_PREVIEW_TOKEN=(.+)$/m,
)?.[1];
if (!password) throw new Error("Start npm run editorial:preview first");
export default defineConfig({
  testDir: "./e2e",
  testMatch: "editorial-private-preview.spec.ts",
  outputDir: "test-results/editorial-preview",
  use: {
    baseURL: "http://127.0.0.1:3102",
    httpCredentials: { username: "editor", password },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "tablet", use: { viewport: { width: 768, height: 1024 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
});
