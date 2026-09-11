import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "../lib/auth/schema";
import { safeNextPath } from "../lib/auth/paths";

describe("auth schema", () => {
  it("rejects a short password on register", () => {
    const result = registerSchema.safeParse({
      displayName: "Arta",
      email: "arta@example.com",
      password: "short",
      confirmPassword: "short",
    });
    expect(result.success).toBe(false);
  });

  it("requires matching passwords", () => {
    const result = registerSchema.safeParse({
      displayName: "Arta",
      email: "arta@example.com",
      password: "password1",
      confirmPassword: "password2",
    });
    expect(result.success).toBe(false);
  });

  it("accepts a valid login payload", () => {
    expect(
      loginSchema.safeParse({ email: "arta@example.com", password: "secret" }).success,
    ).toBe(true);
  });
});

describe("safe next path", () => {
  it("only allows in-site relative paths", () => {
    expect(safeNextPath("/account")).toBe("/account");
    expect(safeNextPath("/checkout")).toBe("/checkout");
    expect(safeNextPath("https://evil.example")).toBe("/account");
    expect(safeNextPath("//evil.example")).toBe("/account");
  });
});
