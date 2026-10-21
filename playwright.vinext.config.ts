import { defineConfig } from "@playwright/test";
import baseline from "./playwright.config";

// Use the same assertions and viewport matrix against the built Worker in workerd.
// Never reuse an arbitrary server: a passing Next.js instance is not Worker evidence.
export default defineConfig({
  ...baseline,
  use: { ...baseline.use, baseURL: "http://127.0.0.1:3101" },
  webServer: {
    command:
      "npm run start:vinext -- --host 127.0.0.1 --port 3101 --strictPort",
    url: "http://127.0.0.1:3101",
    reuseExistingServer: false,
    timeout: 120000,
  },
  outputDir: "test-results/vinext",
});
