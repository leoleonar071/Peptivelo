import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";
import { readFileSync } from "node:fs";
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8")) as { comparisons: { id: string; slug: string }[] };

for (const c of catalog.comparisons.filter((c) => !["niod-vs-ordinary", "ordinary-ha-vs-copper"].includes(c.id))) {
  test(`${c.id}: a withdrawn comparison returns a non-indexable 404`, async ({ request }) => {
    await expectPrivateDrafts(request, [`/compare/${c.slug}/`]);
  });
}
