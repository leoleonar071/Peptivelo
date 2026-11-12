import { randomBytes } from "node:crypto";
import { writeFileSync } from "node:fs";
import { spawn } from "node:child_process";
const token = randomBytes(32).toString("hex");
writeFileSync(
  ".env.editorial-preview.local",
  `# Local preview credentials. Never commit or deploy.\n# URL: http://127.0.0.1:3102/editorial-preview/ghk-cu/\n# Username: editor\nEDITORIAL_PREVIEW_TOKEN=${token}\n`,
  { mode: 0o600 },
);
console.log(
  "Private preview: http://127.0.0.1:3102/editorial-preview/ghk-cu/\nUsername: editor. Password saved locally in .env.editorial-preview.local. Bound to loopback only.",
);
const child = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3102",
  ],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      EDITORIAL_PREVIEW_ENABLED: "true",
      EDITORIAL_PREVIEW_TOKEN: token,
    },
  },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => child.kill(signal));
child.on("exit", (code) => process.exit(code ?? 1));
