export const SESSION_COOKIE = "__session";
export const SESSION_DAYS = 14;
export const SESSION_MAX_AGE = SESSION_DAYS * 24 * 60 * 60;
export const SESSION_EXPIRES_MS = SESSION_MAX_AGE * 1000 - 1000;

export function safeNextPath(value: string | null | undefined, fallback = "/account") {
  if (!value) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) {
    return fallback;
  }
  return value;
}
