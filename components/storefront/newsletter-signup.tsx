"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { t } from "@/lib/i18n/sq";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error(t("home.newsletterInvalid"));
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (!response.ok) throw new Error("newsletter-failed");
      toast.success(t("home.newsletterSuccess"));
      setEmail("");
    } catch {
      toast.error(t("home.newsletterError"));
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="rounded-xl border bg-muted/40 px-4 py-10 md:px-8">
      <div className="mx-auto max-w-xl space-y-3 text-center">
        <h2 className="text-2xl font-semibold tracking-tight">
          {t("home.newsletterTitle")}
        </h2>
        <p className="text-sm text-muted-foreground">{t("home.newsletterBody")}</p>
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("home.newsletterPlaceholder")}
            className="h-10 flex-1"
            aria-label={t("home.newsletterPlaceholder")}
          />
          <Button type="submit" size="lg" disabled={pending} className="h-10">
            {t("home.newsletterSubmit")}
          </Button>
        </form>
      </div>
    </section>
  );
}
