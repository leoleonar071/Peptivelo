import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("withdrawn comparison reader is unavailable", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/niod-cais3-vs-the-ordinary/"]);
  });
