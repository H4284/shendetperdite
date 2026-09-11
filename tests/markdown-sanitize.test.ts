import { describe, expect, it } from "vitest";
import { stripHtml } from "../lib/markdown";

describe("stripHtml", () => {
  it("removes tags from untrusted markdown fragments", () => {
    expect(stripHtml('<script>alert(1)</script>hello')).toBe("alert(1)hello");
  });
});
