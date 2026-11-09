import { fileURLToPath } from "node:url";
import { createServer } from "vite";

const href = process.argv[2];
if (!href?.startsWith("/") || /[?#]/.test(href)) {
  console.error(
    "Usage: npm run publication:inspect -- /exact/route/ [--snapshot]",
  );
  process.exitCode = 1;
} else {
  // Match production defaults without starting a listener, changing review
  // records, enabling indexing or attributing an approval to anyone.
  process.env.NODE_ENV ||= "production";
  const server = await createServer({
    configFile: false,
    resolve: {
      alias: { "@": fileURLToPath(new URL("../src", import.meta.url)) },
    },
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: "error",
  });
  try {
    const registry = await server.ssrLoadModule(
      "/src/lib/publication-registry.ts",
    );
    const document = registry.documentForPath(href);
    if (!document) {
      console.error("No public document adapter exists for this route.");
      process.exitCode = 1;
    } else {
      console.log(
        JSON.stringify(
          {
            documentId: document.id,
            href: document.href,
            policy: registry.policyForPath(href),
            requiredReviews: document.requiresScientificReview
              ? ["editorial", "scientific"]
              : ["editorial"],
            sourceIds: document.sourceIds,
            ...(process.argv.includes("--snapshot")
              ? { revision: document.revision }
              : {}),
          },
          null,
          2,
        ),
      );
    }
  } finally {
    await server.close();
  }
}
