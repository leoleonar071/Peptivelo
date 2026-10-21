import { it, expect } from "vitest";
import { initial, parseRows } from "../src/lib/calculator";
it("rejects malformed and abusive shared state without crashing", () => {
  for (const raw of [
    "{",
    "null",
    "[null,null]",
    "[]",
    JSON.stringify([
      { name: "A", price: "0", size: "0", unit: "ml" },
      { name: "B", price: "1", size: "1", unit: "oz" },
    ]),
    "a".repeat(10001),
  ])
    expect(parseRows(raw)).toEqual(initial);
});
it("restores valid share rows including free products and decimal ounce volumes", () => {
  const rows = [
    { name: "Free", price: "0", size: "30", unit: "ml" },
    { name: "B", price: "32.50", size: "1.5", unit: "oz" },
  ];
  expect(parseRows(JSON.stringify(rows))).toEqual(rows);
});
