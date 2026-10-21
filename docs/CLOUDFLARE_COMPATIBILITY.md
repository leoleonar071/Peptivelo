# Cloudflare compatibility assessment — 2026-10-19

## Outcome and scope

The MVP can build and run locally in the Workers runtime using vinext. This is a **parallel, locally verified integration**, not a production migration or deployment. The original Next.js commands remain the defaults. No Cloudflare login, account selection, remote API write, resource provisioning, domain change or deployment was performed.

## Versions tested

| Component                         | Version        |
| --------------------------------- | -------------- |
| Next.js baseline                  | 16.4.2         |
| React / React DOM / RSC transport | 19.3.1         |
| vinext                            | 1.2.1          |
| Vite                              | 8.3.0          |
| Cloudflare Vite plugin            | 2.0.0-beta.v.2 |
| Cloudflare CLI (`cf`)             | 1.0.0-beta.18  |
| workerd generated runtime types   | 1.20261019.1   |
| Worker compatibility date         | 2026-10-19     |

The upstream initializer now selects the beta `cf` configuration path. It generated `cloudflare.config.ts`, not a Wrangler configuration. Do not mix `cf` and Wrangler configuration files or commands in this project. The Cloudflare Vite plugin and CLI are beta dependencies; retain the baseline until the deployment path has been explicitly reviewed.

## Run the original app

```sh
npm run dev -- --port 3100
# Or the original production build:
npm run build
npm run start -- --port 3100
```

## Run Workers locally

```sh
npm ci
npm run check:vinext
npm run dev:vinext
```

Development uses http://127.0.0.1:3101 with a strict port. To run the built Worker locally instead:

```sh
npm run build:vinext
npm run start:vinext -- --host 127.0.0.1 --port 3101 --strictPort
```

These commands use the Cloudflare Vite plugin and local workerd. They do not deploy. No D1, R2, KV, Hyperdrive, image service, external database, persistent data cache, or remote binding is configured. `ASSETS` is the local build's static file binding. `SITE_INDEXABLE` is explicitly false in the Worker configuration. Public Workers subdomains and preview URLs are disabled in this local-first configuration. Before a future deployment, select its real domain/origin and access policy deliberately.

The application's fallback canonical origin is still `http://localhost:3000` when `NEXT_PUBLIC_SITE_URL` is absent. This preserves baseline behavior; it is not a production domain. Configure the actual origin **before building**, inspect rendered canonical/OG/sitemap values, and keep indexing disabled until editorial/legal launch requirements are complete.

## Configuration and outputs

- `vite.config.ts`: vinext plus Cloudflare's native RSC/SSR multi-environment integration. Application imports stay `next/*`; the framework resolves its own compatibility layer.
- `cloudflare.config.ts`: generated framework fetch entry, current compatibility date, `nodejs_compat`, local static assets, explicit prelaunch noindex value, query-string redaction and sampled observability settings. These settings have not been activated in a Cloudflare account.
- `.cloudflare/output/`: generated Worker build, ignored by version control.
- `.cloudflare/types/`: generated Cloudflare declarations; regenerate using `npm run types:workers`.
- `playwright.vinext.config.ts`: same assertions and three viewports as the baseline, on a dedicated Worker preview port. It does not reuse another server, preventing accidental validation against Next.js.
- `.migration-backup/next-baseline-2026-10-19/`: local original package/config files and an archive of application source, tests and docs. This backup is ignored and is not deployed.

No deploy script is added to the final project scripts. Publication is a separate future action.

## Compatibility findings and fixes

`vinext check` reported 15 supported checks, zero partial checks and zero issues: the three used runtime `next/*` imports, two Next config options, four libraries and the App Router structure. This is static evidence only, supplemented by runtime testing.

The first Worker browser run passed 20 of 21 tests and exposed an intermittent early-click failure in the mobile comparator under parallel load. A single-worker diagnostic repeated that flow five times successfully, pointing to client readiness rather than missing data. The fix disables the comparison fieldset until React's client snapshot is ready. An additional regression test deliberately holds all external JS requests, confirms the action is disabled in server HTML, releases the scripts, then performs the comparison. No test timeout or retry was added to hide the lost action. This small application fix also applies to Next.js.

The initializer generated vinext route types into `.next/types/`, conflicting with a previous Next.js validator. `typecheck` now runs Next's supported type generation before `tsc`; Next remains the type-checking baseline. Both builds are tested. Generated framework output, local backups and installed skill files are excluded from linting, while application and configuration files remain checked.

An inherited `fflate` advisory was resolved with a pinned 0.7.5 override within its existing minor line. Rebuilds and browser tests were run with the override in place.

## Verification

| Check                               | Result                                                       |
| ----------------------------------- | ------------------------------------------------------------ |
| Static compatibility scan           | 15 supported, 0 partial, 0 issues                            |
| Worker production build             | Pass                                                         |
| Worker development server           | Starts; home and product HTTP 200, no browser runtime errors |
| Original Next.js production build   | Pass                                                         |
| Browser suite on built local Worker | 24 passed across desktop, tablet and mobile                  |
| Browser suite on original Next.js   | 24 passed across desktop, tablet and mobile                  |
| Unit tests                          | 11 passed                                                    |
| PostgreSQL schema validation        | Pass; no database connection or migration                    |
| Worker type generation              | Pass                                                         |
| Lint and TypeScript                 | Both pass with no application/configuration errors           |

Runtime assertions cover SSR label facts, canonical/metadata updates after client navigation, source URLs, actual HTTP 404, parameter URL noindex headers, draft noindex metadata, robots/sitemap responses, browser errors, search, comparisons, arithmetic, validation, URL restoration, responsive overflow and automated WCAG A/AA checks on core pages. They include a deliberate delayed-JavaScript hydration regression.

## Remaining limits

1. **No production deployment evidence.** Account permissions, custom domain/TLS, real caching policy, deployment size/CPU limits, production logs, rollbacks, billing and remote runtime behavior still need a controlled staging assessment.
2. **Beta integration.** The current official initializer uses beta Cloudflare tooling. Compatibility with this app is demonstrated locally, not guaranteed for all Next.js features or future upgrades. Pin the lockfile and repeat checks after upgrading.
3. **Build warnings.** Upstream RSC plugins report incomplete source maps and ineffective dynamic imports. The route summary cannot classify the home route statically. These warnings did not block the build or the tested runtime flows. Full build output is retained locally at `.migration-backup/vinext-build.log`.
4. **Dependency advisories.** After the `fflate` correction, `npm audit` reports nine high-severity entries, all reaching the unpatched `braces` glob-pattern advisory through `fast-glob`/`micromatch`. Five entries also existed in the Next linter baseline; the additional chain is through vinext's CommonJS build plugins and its Cloudflare wrapper. **`npm audit --omit=dev` now reports seven high entries**, since the official initializer installs vinext and its wrapper as normal dependencies. The original project's previous zero-production-findings result must not be reused for this expanded dependency tree. This dependency risk is not a statement that user request input reaches the affected code. No compatible published braces patch was available in the registry checked. Do not apply npm's suggested major downgrade blindly or reclassify dependencies just to hide findings. Recheck before staging/production.
5. **Product launch requirements remain.** PostgreSQL persistence, qualified scientific review, final legal/operator information, real analytics and affiliate agreements are unchanged and not claimed to be connected.

## Reverting or choosing a runtime

No runtime switch is needed to return to Next.js: use `npm run dev`, `npm run build` and `npm run start`. The source uses the same Next imports. To remove the experiment entirely, review the backup and remove the added Cloudflare/Vite dependencies, configurations and scripts as a separate change; preserve the client-readiness fix and expanded tests where useful. Do not restore the archived source over later user edits without reviewing the differences.

## References consulted

- [Official migration skill](https://github.com/cloudflare/vinext/blob/main/.agents/skills/migrate-to-vinext/SKILL.md), installed locally under `.agents/skills/migrate-to-vinext/`.
- [vinext project status and documentation](https://github.com/cloudflare/vinext).
- [Cloudflare Next.js guide](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/).
- Installed package help, types and configuration schema were used to reconcile the newer `cf` initializer with older Wrangler examples in the migration references. The live `/cf/index.md` and `/cf/agents/index.md` documentation URLs could not be retrieved by the web tool during this session; no remote commands were inferred from unavailable documentation.
