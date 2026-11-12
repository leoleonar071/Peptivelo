import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("withdrawn priority readers do not expose source context", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-multi-peptide-ha-vs-copper/","/compare/niod-cais3-vs-the-ordinary/"]);
  });
