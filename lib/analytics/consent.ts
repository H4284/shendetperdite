export const CONSENT_KEY = "sp-cookie-consent";
export const PREFS_KEY = "sp-cookie-preferences";
export const CONSENT_EVENT = "sp-cookie-consent-change";

export type CookiePrefs = {
  necessary: true;
  analytics: boolean;
};

export function readAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const consent = window.localStorage.getItem(CONSENT_KEY);
    if (consent !== "accepted") return false;
    const stored = window.localStorage.getItem(PREFS_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as CookiePrefs;
    return Boolean(parsed.analytics);
  } catch {
    return false;
  }
}

export function writeCookieConsent(prefs: CookiePrefs) {
  window.localStorage.setItem(CONSENT_KEY, "accepted");
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  window.dispatchEvent(
    new CustomEvent(CONSENT_EVENT, { detail: { analytics: prefs.analytics } }),
  );
}
