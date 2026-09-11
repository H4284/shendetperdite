import { describe, expect, it } from "vitest";
import { rateLimit } from "../lib/auth/rate-limit";

describe("rateLimit", () => {
  it("returns 429 after 10 hits in the window", () => {
    const key = `test-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 10; i += 1) {
      expect(rateLimit(key, 10, 60_000).ok).toBe(true);
    }
    expect(rateLimit(key, 10, 60_000).ok).toBe(false);
  });
});
