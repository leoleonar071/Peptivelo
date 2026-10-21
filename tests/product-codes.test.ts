import { expect, it } from "vitest";
import { resolveProductCode } from "../src/lib/product-codes";

it("matches exact local product QR links without trusting other hosts or invented barcodes", () => {
  const origin = "http://localhost:3102";
  expect(
    resolveProductCode(
      `${origin}/skincare/products/the-ordinary-multi-peptide-copper/`,
      origin,
    )?.id,
  ).toBe("ordinary-copper");
  for (const input of [
    "https://evil.example/skincare/products/the-ordinary-multi-peptide-copper/",
    "javascript:alert(1)",
    "ordinary-copper",
    "123456789012",
    "https://localhost:3102.evil.example/skincare/products/the-ordinary-multi-peptide-copper/",
    `${origin}/skincare/products/the-ordinary-multi-peptide-copper/extra`,
    `${origin}/skincare/products/unknown/`,
  ]) {
    expect(resolveProductCode(input, origin)).toBeUndefined();
  }
});
