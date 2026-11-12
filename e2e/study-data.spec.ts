import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("the withdrawn comparison does not expose study data", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/niod-cais3-vs-the-ordinary/"]);
  });
