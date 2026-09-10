"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { t } from "@/lib/i18n/sq";

const CONSENT_KEY = "sp-cookie-consent";
const PREFS_KEY = "sp-cookie-preferences";

type CookiePrefs = {
  necessary: true;
  analytics: boolean;
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      const consent = window.localStorage.getItem(CONSENT_KEY);
      setVisible(consent !== "accepted");
      const stored = window.localStorage.getItem(PREFS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CookiePrefs;
        setAnalytics(Boolean(parsed.analytics));
      }
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(prefs: CookiePrefs) {
    window.localStorage.setItem(CONSENT_KEY, "accepted");
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    setVisible(false);
    setSettingsOpen(false);
  }

  function acceptAll() {
    persist({ necessary: true, analytics: true });
  }

  function saveSettings() {
    persist({ necessary: true, analytics });
  }

  if (!visible && !settingsOpen) return null;

  return (
    <>
      {visible ? (
        <section
          aria-label={t("cookie.region")}
          className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <p className="max-w-3xl text-sm text-muted-foreground">
              {t("cookie.body")}{" "}
              <Link
                href="/privacy"
                className="text-foreground underline underline-offset-4"
              >
                {t("cookie.privacy")}
              </Link>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={() => setSettingsOpen(true)}
              >
                {t("cookie.settings")}
              </Button>
              <Button onClick={acceptAll}>{t("cookie.accept")}</Button>
            </div>
          </div>
        </section>
      ) : null}

      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("cookie.settingsTitle")}</DialogTitle>
            <DialogDescription>{t("cookie.settingsDescription")}</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <label className="flex items-start gap-3 text-sm">
              <Checkbox checked disabled aria-label={t("cookie.necessary")} />
              <span>
                <span className="font-medium">{t("cookie.necessary")}</span>
                <span className="mt-0.5 block text-muted-foreground">
                  {t("cookie.necessaryHelp")}
                </span>
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm">
              <Checkbox
                checked={analytics}
                onCheckedChange={(checked) => setAnalytics(checked)}
                aria-label={t("cookie.analytics")}
              />
              <span>
                <span className="font-medium">{t("cookie.analytics")}</span>
                <span className="mt-0.5 block text-muted-foreground">
                  {t("cookie.analyticsHelp")}
                </span>
              </span>
            </label>
          </div>
          <DialogFooter>
            <Button onClick={saveSettings}>{t("cookie.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
