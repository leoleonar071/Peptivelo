import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("withdrawn Matrixyl reader cannot expose offers or evidence", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/"]);
  });

test("deep links to the withdrawn Matrixyl reader remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-matrixyl-vs-multi-peptide-ha/?returnTo=/compare/"]);
  });
