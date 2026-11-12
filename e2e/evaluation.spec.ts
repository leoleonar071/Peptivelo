import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("draft comparison evaluation remains private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/niod-cais3-vs-the-ordinary/"]);
  });
