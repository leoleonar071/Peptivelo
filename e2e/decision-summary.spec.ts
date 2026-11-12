import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("priority comparison summaries remain private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/compare/the-ordinary-multi-peptide-ha-vs-copper/","/compare/niod-cais3-vs-the-ordinary/"]);
  });
