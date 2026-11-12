import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("a deep link cannot expose the withdrawn reader", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/niod-cais3-vs-the-ordinary/?tab=evidence"]);
  });
