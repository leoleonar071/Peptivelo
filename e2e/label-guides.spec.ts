import { expectPrivateDrafts } from "./draft-route-assertions";
import { test } from "@playwright/test";

test("the draft label guide remains private", async ({ request }) => {
    await expectPrivateDrafts(request, ["/skincare/guides/matrixyl-3000-vs-synthe6/"]);
  });

test("the draft percentages guide stays unavailable", async ({ request }) => {
    await expectPrivateDrafts(request, ["/skincare/guides/peptide-percentages-explained/"]);
  });
