import { expect, it, vi } from "vitest";
import { track } from "../src/lib/analytics";

it("emits a local event with allowed metadata while discarding free-form or sensitive fields", () => {
  const bus = new EventTarget();
  vi.stubGlobal("window", bus);
  const events: unknown[] = [];
  bus.addEventListener("atlas:analytics", (event) =>
    events.push((event as CustomEvent).detail),
  );
  try {
    track("search_submitted", {
      source: "search_form",
      q: "personal medical query",
      email: "person@example.com",
      url: "/search/?q=private",
    });
    expect(events).toEqual([
      { name: "search_submitted", source: "search_form" },
    ]);
    track("search_no_results", {
      length: Infinity,
      source: "person@example.com",
    });
    expect(events[1]).toEqual({ name: "search_no_results" });
  } finally {
    vi.unstubAllGlobals();
  }
});
